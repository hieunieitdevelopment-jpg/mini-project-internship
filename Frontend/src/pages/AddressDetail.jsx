import L from "leaflet";
import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ geojson, center }) {
  const map = useMap();

  useEffect(() => {
    if (geojson) {
      const layer = L.geoJSON(geojson);
      const bounds = layer.getBounds();
      // Kiểm tra nếu có giới hạn hợp lệ thì thu phóng, cấu hình maxZoom = 14 để không bị zoom quá sát
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      } else if (center) {
        map.setView(center, 14);
      }
    } else if (center) {
      map.setView(center, 14);
    }
  }, [geojson, center, map]);

  return null;
}

function AddressDetail() {
  const { id } = useParams();
  const location = useLocation();
  
  // Sử dụng sessionStorage để giữ lại dữ liệu mapping khi F5/Reload trang
  const [mapping] = useState(() => {
    if (location.state?.mapping) {
      sessionStorage.setItem(`mapping_${id}`, JSON.stringify(location.state.mapping));
      return location.state.mapping;
    }
    try {
      const saved = sessionStorage.getItem(`mapping_${id}`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State chứa dữ liệu bản đồ
  const [mapData, setMapData] = useState({
    lat: 16.0471, // Mặc định Toạ độ ban đầu
    lng: 108.2068,
    geojson: null,
    displayName: "Đang tải vị trí..."
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // 1. Lấy thông tin đơn vị từ Database của bạn
        const res = await fetch(`http://44.202.66.188:3000/api/v1/units/${id}`);
        const json = await res.json();
        const unitData = json.data;

        if (unitData) {
          setUnit(unitData);

          // 2. Dựng chuỗi địa chỉ đầy đủ
          const addressParts = [unitData.name];
          if (unitData.parent) addressParts.push(unitData.parent);
          if (unitData.grandparent) addressParts.push(unitData.grandparent);
          const fullAddress = addressParts.join(", ");

          // Tách các tiền tố hành chính (Xã, Huyện, Tỉnh...) vì OpenStreetMap thường khớp tên gốc tốt hơn
          const cleanName = unitData.name ? unitData.name.replace(/^(Xã|Phường|Thị trấn|Huyện|Quận|Thị xã|Tỉnh|Thành phố|TP\.?)\s+/i, "").trim() : "";
          const cleanParent = unitData.parent ? unitData.parent.replace(/^(Xã|Phường|Thị trấn|Huyện|Quận|Thị xã|Tỉnh|Thành phố|TP\.?)\s+/i, "").trim() : "";
          const cleanGrandparent = unitData.grandparent ? unitData.grandparent.replace(/^(Xã|Phường|Thị trấn|Huyện|Quận|Thị xã|Tỉnh|Thành phố|TP\.?)\s+/i, "").trim() : "";

          let location = null;

          // --- NEW STRATEGY ---
          // Hàm thực hiện tìm kiếm và trả về kết quả nếu có
          const nominatimSearch = async (params) => {
            const searchParams = new URLSearchParams({
              ...params,
              format: 'json',
              polygon_geojson: 1,
              limit: 1,
              countrycodes: 'vn' // Luôn giới hạn trong Việt Nam
            });
            const url = `https://nominatim.openstreetmap.org/search?${searchParams.toString()}`;
            try {
              const res = await fetch(url);
              if (!res.ok) return null;
              const data = await res.json();
              if (Array.isArray(data) && data.length > 0) {
                return data[0];
              }
            } catch (e) {
              console.error(`Nominatim search failed for ${url}`, e);
            }
            return null;
          };
          
          // 1. Tìm kiếm có cấu trúc (ưu tiên cao nhất): Xã/Phường (q) + Huyện/Quận (county) + Tỉnh/TP (state)
          if (cleanName && cleanParent && cleanGrandparent) {
            location = await nominatimSearch({ state: cleanGrandparent, county: cleanParent, q: cleanName });
          }
          
          // 2. Dự phòng: Bỏ qua Huyện/Quận (do dữ liệu có thể thiếu)
          if (!location && cleanName && cleanGrandparent) {
            await new Promise(r => setTimeout(r, 600)); // Delay để tránh rate limit
            location = await nominatimSearch({ state: cleanGrandparent, q: cleanName });
          }
          
          // 3. Dự phòng: Tìm theo Huyện/Quận + Tỉnh/TP
          if (!location && cleanParent && cleanGrandparent) {
            await new Promise(r => setTimeout(r, 600));
            location = await nominatimSearch({ state: cleanGrandparent, county: cleanParent });
          }
          
          // 4. Dự phòng cuối cùng: Tìm theo tên Tỉnh/TP
          if (!location && cleanGrandparent) {
            await new Promise(r => setTimeout(r, 600));
            location = await nominatimSearch({ state: cleanGrandparent });
          }

          if (location) {
            setMapData({
              lat: parseFloat(location.lat),
              lng: parseFloat(location.lon),
              geojson: location.geojson ? {
                type: "Feature",
                properties: { name: fullAddress },
                geometry: location.geojson
              } : null,
              displayName: location.display_name
            });
          } else {
            setMapData((prev) => ({ ...prev, displayName: "Không tìm thấy toạ độ chính xác trên bản đồ." }));
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const formatFullAddress = () => {
    if (!unit) return "";
    const parts = [unit.name];
    if (unit.parent) parts.push(unit.parent);
    if (unit.grandparent) parts.push(unit.grandparent);
    return parts.join(" • ");
  };

  // Hàm format địa chỉ cũ/mới để hiển thị
  const formatAddressMapping = (u, isNew = false) => {
    if (!u) return "—";
    const parts = [u.name];
    if (u.level === "ward") {
      if (isNew) {
        const province = u.grandparent || u.parent;
        if (province) parts.push(province);
      } else {
        if (u.parent) parts.push(u.parent);
        if (u.grandparent) parts.push(u.grandparent);
      }
    } else if (u.level === "district") {
      if (u.parent) parts.push(u.parent);
      if (u.grandparent) parts.push(u.grandparent);
    }
    return parts.join(" • ");
  };

  return (

    <div className="max-w-6xl mx-auto p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen pt-6">

      <div className="mb-8">

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay về
        </Link>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Chi tiết địa chỉ #{id}
        </h1>
        <p className="text-lg text-gray-600">
          Thông tin chi tiết về thay đổi địa giới hành chính
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Đang tải thông tin...</p>
        </div>
      ) : (
        <>
          {/* ADDRESS DETAILS */}
          {mapping ? (
            <>
              {mapping.change && (
                <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-6 md:mb-8 border-l-4 border-yellow-400">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">📜</span>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">Thông tin nghị quyết</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base text-gray-700 bg-yellow-50 p-4 md:p-5 rounded-xl border border-yellow-100">
                    <p><strong>Số nghị quyết:</strong> {mapping.change.resolution_number || "—"}</p>
                    <p><strong>Ngày hiệu lực:</strong> {mapping.change.effective_date ? new Date(mapping.change.effective_date).toLocaleDateString('vi-VN') : "—"}</p>
                    <p><strong>Loại thay đổi:</strong> <span className="capitalize font-medium text-blue-700">{mapping.change.type === 'merge' ? 'Sáp nhập' : mapping.change.type === 'split' ? 'Chia tách' : mapping.change.type === 'rename' ? 'Đổi tên' : mapping.change.type || "—"}</span></p>
                    <p className="sm:col-span-2 leading-relaxed"><strong>Mô tả chi tiết:</strong> {mapping.change.description || "—"}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
                <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border-l-4 border-red-400">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🏠</span>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">Địa chỉ cũ</h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                    {formatAddressMapping(mapping.old_unit, false)}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 border-l-4 border-green-400">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🏢</span>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">Địa chỉ mới</h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed font-medium">
                    {formatAddressMapping(mapping.new_unit, true)}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8 md:mb-10 border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🏛️</span>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {unit?.active ? "Địa chỉ hành chính Mới" : "Địa chỉ hành chính Cũ"}
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm md:text-base text-gray-700">
                  <strong>Đơn vị: </strong> {unit?.name || "Không xác định"}
                </p>
                <p className="text-sm md:text-base text-gray-700">
                  <strong>Cấp hành chính: </strong>
                  {unit?.level === "ward" ? "Xã/Phường" : unit?.level === "district" ? "Huyện/Quận" : "Tỉnh/Thành phố"}
                </p>
                <p className="text-sm md:text-base text-gray-700">
                  <strong>Địa chỉ đầy đủ: </strong> {formatFullAddress() || "Không xác định"}
                </p>
              </div>
            </div>
          )}

          {/* MAP */}
          <div className="mb-8 md:mb-10 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <span>📍</span> Bản đồ vị trí {unit && <span className="text-blue-600 text-lg md:text-xl ml-2">({unit.name})</span>}
              </h2>
            </div>

            <div className="p-4 md:p-6">
              <MapContainer
                center={[mapData.lat, mapData.lng]}
                zoom={13}
                style={{ height: "450px", width: "100%" }}
                className="rounded-xl shadow-inner w-full h-[300px] md:h-[450px]"
              >
                <FitBounds geojson={mapData.geojson} center={[mapData.lat, mapData.lng]} />

                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapData.geojson && (
                  <GeoJSON
                    data={mapData.geojson}
                    style={{
                      color: "#2563eb",
                      weight: 3,
                      opacity: 0.7,
                      fillOpacity: 0.15,
                      fillColor: "#3b82f6"
                    }}
                  />
                )}

                <Marker position={[mapData.lat, mapData.lng]}>
                  <Popup className="rounded-lg">
                    <div className="text-center">
                      <strong>{unit?.name}</strong>
                      <br />
                      <span className="text-xs text-gray-500">{mapData.displayName}</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </>
      )}

    </div>

  );
}

export default AddressDetail;