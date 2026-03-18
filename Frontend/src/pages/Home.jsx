import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [convertType, setConvertType] = useState("oldToNew");
  const [searchMode, setSearchMode] = useState("quick");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const res = await fetch("http://44.202.66.188:3000/api/v1/provinces");
      const json = await res.json();
      setProvinces(json.data || []);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    setSelectedProvince(id);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    if (id) {
      if (convertType === "newToOld") {
        fetchWardsByProvince(id, true);
      } else {
        fetchDistricts(id);
      }
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const res = await fetch(
        `http://44.202.66.188:3000/api/v1/provinces/${provinceId}/districts`
      );
      const json = await res.json();
      setDistricts(json.data || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    setSelectedDistrict(id);
    setSelectedWard("");
    setWards([]);
    if (id) fetchWards(id, false);
  };

  const fetchWards = async (districtId, active) => {
    try {
      const res = await fetch(
        `http://44.202.66.188:3000/api/v1/districts/${districtId}/wards?active=${active}`
      );
      const json = await res.json();
      setWards(json.data || []);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const fetchWardsByProvince = async (provinceId, active) => {
    try {
      const res = await fetch(
        `http://44.202.66.188:3000/api/v1/provinces/${provinceId}/wards?active=${active}`
      );
      const json = await res.json();
      setWards(json.data || []);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const fetchOldToNew = async (province, district, ward) => {
    const url = `http://44.202.66.188:3000/api/v1/mappings?direction=old-to-new&province=${encodeURIComponent(province || "")}&district=${encodeURIComponent(district || "")}&ward=${encodeURIComponent(ward || "")}`;
    const res = await fetch(url);
    return res.json();
  };

  const fetchNewToOld = async (province, district, ward) => {
    const url = `http://44.202.66.188:3000/api/v1/mappings?direction=new-to-old&province=${encodeURIComponent(province || "")}&district=${encodeURIComponent(district || "")}&ward=${encodeURIComponent(ward || "")}`;
    const res = await fetch(url);
    return res.json();
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const formatAddressDetail = (unit, isNew = false) => {
    if (!unit) return "—";
    const parts = [];
    if (unit.level === "ward") {
      parts.push(unit.name);
      if (isNew) {
        const province = unit.grandparent || unit.parent;
        if (province) parts.push(` • ${province}`);
      } else {
        if (unit.parent) parts.push(` • ${unit.parent}`);
        if (unit.grandparent) parts.push(` • ${unit.grandparent}`);
      }
    } else if (unit.level === "district") {
      parts.push(unit.name);
      if (unit.parent) parts.push(` • ${unit.parent}`);
      if (unit.grandparent) parts.push(` • ${unit.grandparent}`);
    } else if (unit.level === "province") {
      parts.push(unit.name);
    }
    return parts.join("");
  };

  const handleQuickSearchChange = async (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // We mainly want ward suggestions → force level=ward
      // API doesn't seem to support parent filtering reliably, so we keep it simple
      const q = encodeURIComponent(value.trim());
      const url = `http://44.202.66.188:3000/api/v1/units/suggest?q=${q}&level=ward`;

      const res = await fetch(url);
      const json = await res.json();
      setSuggestions(json.data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Suggestion error:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (unit) => {
    if (unit.level !== "ward") {
      alert("Hiện tại chỉ hỗ trợ tra cứu theo Xã/Phường.");
      return;
    }

    setKeyword(unit.name);
    setShowSuggestions(false);
    setSuggestions([]);

    // Trigger search immediately
    performWardSearch(unit.name);
  };

  const performWardSearch = async (wardName) => {
    if (!wardName.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const direction = convertType === "oldToNew" ? "old-to-new" : "new-to-old";
      const url = `http://44.202.66.188:3000/api/v1/mappings?direction=${direction}&ward=${encodeURIComponent(
        wardName
      )}`;

      const res = await fetch(url);
      const json = await res.json();

      if (!json.data?.length) {
        alert(`Không tìm thấy dữ liệu thay đổi địa giới cho "${wardName}".`);
      }

      setResults(json.data || []);
    } catch (err) {
      console.error("Search error:", err);
      alert("Có lỗi khi tra cứu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = () => {
    const ward = keyword.trim();
    if (!ward) {
      alert("Vui lòng nhập tên Xã/Phường.");
      return;
    }
    performWardSearch(ward);
  };

  const handleSearch = async () => {
    if (!selectedProvince) {
      alert("Vui lòng chọn Tỉnh/Thành phố.");
      return;
    }
    if (convertType === "oldToNew" && !selectedDistrict) {
      alert("Vui lòng chọn Huyện/Quận.");
      return;
    }
    if (!selectedWard) {
      alert("Vui lòng chọn Xã/Phường.");
      return;
    }

    const provinceObj = provinces.find((p) => p.id == selectedProvince);
    const districtObj = districts.find((d) => d.id == selectedDistrict);
    const wardObj = wards.find((w) => w.id == selectedWard);

    setLoading(true);
    setResults([]);

    try {
      let json;
      if (convertType === "oldToNew") {
        json = await fetchOldToNew(provinceObj?.name, districtObj?.name, wardObj?.name);
      } else {
        json = await fetchNewToOld(provinceObj?.name, districtObj?.name, wardObj?.name);
      }

      if (!json.data?.length) {
        alert(`Không tìm thấy dữ liệu thay đổi địa giới cho "${wardObj?.name}".`);
      }

      setResults(json.data || []);
    } catch (err) {
      console.error("Search error:", err);
      alert("Có lỗi khi tra cứu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Tra cứu thay đổi địa giới hành chính
        </h1>
        <p className="text-lg text-gray-600">
          Kiểm tra địa chỉ cũ – mới theo nghị quyết chính thức
        </p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center items-center gap-8 mb-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <span
            className={`text-lg font-medium transition-colors ${
              convertType === "oldToNew" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Cũ → Mới
          </span>

          <button
            className={`w-16 h-8 rounded-full flex items-center px-1 transition-all duration-300 shadow-inner ${
              convertType === "oldToNew" ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => {
              setConvertType(convertType === "oldToNew" ? "newToOld" : "oldToNew");
              setSelectedProvince("");
              setSelectedDistrict("");
              setSelectedWard("");
              setDistricts([]);
              setWards([]);
              setResults([]);
            }}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${
                convertType === "oldToNew" ? "" : "translate-x-8"
              }`}
            />
          </button>

          <span
            className={`text-lg font-medium transition-colors ${
              convertType === "newToOld" ? "text-blue-600" : "text-gray-500"
            }`}
          >
            Mới → Cũ
          </span>
        </div>

        <button
          onClick={() => setSearchMode(searchMode === "quick" ? "dropdown" : "quick")}
          className="border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm"
        >
          🔄
        </button>
      </div>

      {/* QUICK SEARCH */}
      {searchMode === "quick" && (
        <div className="mb-10">
          <div className="flex gap-4 bg-white rounded-2xl shadow-lg p-6 relative">
            <input
              type="text"
              placeholder="Gõ tên Xã/Phường (ví dụ: Ea Tam, Phú Lộc, ...)"
              className="border-2 border-gray-200 p-4 flex-1 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm"
              value={keyword}
              onChange={handleQuickSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuickSearch();
              }}
            />

            <button
              onClick={handleQuickSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? "Đang tra cứu..." : "Tra cứu"}
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-10 max-h-72 overflow-y-auto">
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-sm text-gray-600">
                      {s.level === "ward" ? "Xã/Phường" : s.level === "district" ? "Huyện/Quận" : "Tỉnh/TP"}
                      {convertType === "newToOld" && s.level === "ward" ? (
                        (s.grandparent || s.parent) ? ` • ${s.grandparent || s.parent}` : null
                      ) : (
                        <>
                          {s.parent && ` • ${s.parent}`}
                          {s.grandparent && ` • ${s.grandparent}`}
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DROPDOWN SEARCH */}
      {searchMode === "dropdown" && (
        <div className={`grid grid-cols-1 ${convertType === "newToOld" ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6 mb-10 bg-white rounded-2xl shadow-lg p-8`}>
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors shadow-sm"
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {convertType === "oldToNew" && (
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedProvince}
              className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors shadow-sm disabled:opacity-50"
            >
              <option value="">-- Chọn Huyện/Quận --</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedWard}
            onChange={handleWardChange}
            disabled={convertType === "oldToNew" ? !selectedDistrict : !selectedProvince}
            className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors shadow-sm disabled:opacity-50"
          >
            <option value="">-- Chọn Xã/Phường --</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <div className={`${convertType === "newToOld" ? "md:col-span-2" : "md:col-span-3"} text-center mt-2`}>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-12 py-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? "Đang tra cứu..." : "Tra cứu"}
            </button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      <div className="border-2 border-gray-200 rounded-2xl p-8 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Kết Quả Tra Cứu
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : results.length > 0 ? (
          <div className="space-y-8">
            {results.map((mapping, idx) => (
              <div key={idx} className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition">
                  <div>
                    <div className="text-sm uppercase tracking-wide text-gray-500 font-medium">
                      Địa chỉ cũ
                    </div>
                    <div className="mt-1 text-gray-800 font-medium">
                      {formatAddressDetail(mapping.old_unit, false)}
                    </div>
                  </div>
                  <Link
                    to={`/address/${mapping.old_unit?.id}`}
                    className="border-2 border-blue-500 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition font-medium whitespace-nowrap"
                  >
                    Chi tiết
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition">
                  <div>
                    <div className="text-sm uppercase tracking-wide text-blue-700 font-medium">
                      Địa chỉ mới
                    </div>
                    <div className="mt-1 text-gray-800 font-medium">
                      {formatAddressDetail(mapping.new_unit, true)}
                    </div>
                  </div>
                  <Link
                    to={`/address/${mapping.new_unit?.id}`}
                    className="border-2 border-blue-600 text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium whitespace-nowrap"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            Chưa có kết quả. Vui lòng nhập tên xã/phường và tra cứu.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;