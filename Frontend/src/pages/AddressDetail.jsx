import L from "leaflet";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitBounds({ geojson }) {
  const map = useMap();

  useEffect(() => {
    if (!geojson) return;
    const layer = L.geoJSON(geojson);
    map.fitBounds(layer.getBounds(), { padding: [40, 40] });
  }, [geojson, map]);

  return null;
}

function AddressDetail() {

  const { id } = useParams();

  // mock data (sau này lấy từ API)
  const data = {
    oldAddress: "Phường Hòa Thọ Đông, Quận Cẩm Lệ, Thành phố Đà Nẵng",
    newAddress: "Phường Cẩm Lệ, Thành phố Đà Nẵng",
    lat: 16.0471,
    lng: 108.2068
  };

  // Mock boundary polygon (rough area around Đà Nẵng) for highlight
  const boundaryGeoJSON = {
    type: "Feature",
    properties: { name: "Đà Nẵng" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [108.130, 16.060],
          [108.260, 16.060],
          [108.260, 16.000],
          [108.130, 16.000],
          [108.130, 16.060]
        ]
      ]
    }
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

      {/* ADDRESS DETAILS */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">

        {/* OLD ADDRESS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-400">

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏠</span>
            <h3 className="text-xl font-semibold text-gray-800">Địa chỉ cũ</h3>
          </div>

          <p className="text-gray-700 leading-relaxed">{data.oldAddress}</p>

        </div>

        {/* NEW ADDRESS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-400">

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏢</span>
            <h3 className="text-xl font-semibold text-gray-800">Địa chỉ mới</h3>
          </div>

          <p className="text-gray-700 leading-relaxed">{data.newAddress}</p>

        </div>

      </div>

      {/* MAP */}
      <div className="mb-10 bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
            <span>📍</span>
            Bản đồ vị trí
          </h2>
        </div>

        <div className="p-6">
          <MapContainer
            center={[data.lat, data.lng]}
            zoom={13}
            style={{ height: "450px", width: "100%" }}
            className="rounded-xl shadow-inner"
          >

            <FitBounds geojson={boundaryGeoJSON} />

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <GeoJSON
              data={boundaryGeoJSON}
              style={{
                color: "#2563eb",
                weight: 3,
                opacity: 0.7,
                fillOpacity: 0.15,
                fillColor: "#3b82f6"
              }}
            />

            <Marker position={[data.lat, data.lng]}>
              <Popup className="rounded-lg">
                <div className="text-center">
                  <strong>{data.newAddress}</strong>
                </div>
              </Popup>
            </Marker>

          </MapContainer>
        </div>

      </div>

    </div>

  );
}

export default AddressDetail;