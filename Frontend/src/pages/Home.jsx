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
      const res = await fetch("/api/v1/provinces");
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
        `/api/v1/provinces/${provinceId}/districts`
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
        `/api/v1/districts/${districtId}/wards?active=${active}`
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
        `/api/v1/provinces/${provinceId}/wards?active=${active}`
      );
      const json = await res.json();
      setWards(json.data || []);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const fetchOldToNew = async (province, district, ward) => {
    const url = `/api/v1/mappings?direction=old-to-new&province=${encodeURIComponent(province || "")}&district=${encodeURIComponent(district || "")}&ward=${encodeURIComponent(ward || "")}`;
    const res = await fetch(url);
    return res.json();
  };

  const fetchNewToOld = async (province, district, ward) => {
    const url = `/api/v1/mappings?direction=new-to-old&province=${encodeURIComponent(province || "")}&district=${encodeURIComponent(district || "")}&ward=${encodeURIComponent(ward || "")}`;
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
      const url = `/api/v1/units/suggest?q=${q}&level=ward`;

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
      const url = `/api/v1/mappings?direction=${direction}&ward=${encodeURIComponent(
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

  const buildExportRows = () => {
    return results.map((mapping) => ({
      old_unit_name: mapping.old_unit?.name || "",
      old_unit_level: mapping.old_unit?.level || "",
      old_parent: mapping.old_unit?.parent || "",
      old_grandparent: mapping.old_unit?.grandparent || "",
      new_unit_name: mapping.new_unit?.name || "",
      new_unit_level: mapping.new_unit?.level || "",
      new_parent: mapping.new_unit?.parent || "",
      new_grandparent: mapping.new_unit?.grandparent || "",
      change_type: mapping.change?.type || "",
      resolution_number: mapping.change?.resolution_number || "",
      effective_date: mapping.change?.effective_date || "",
      description: mapping.change?.description || "",
    }));
  };

  const getExportFileName = (extension) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    return `ket-qua-tra-cuu-${timestamp}.${extension}`;
  };

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    if (!results.length) {
      alert("Không có dữ liệu để export.");
      return;
    }

    const rows = buildExportRows();
    const jsonContent = JSON.stringify(rows, null, 2);
    downloadFile(jsonContent, getExportFileName("json"), "application/json;charset=utf-8;");
  };

  const handleExportCsv = () => {
    if (!results.length) {
      alert("Không có dữ liệu để export.");
      return;
    }

    const rows = buildExportRows();
    const headers = Object.keys(rows[0]);

    const escapeCsvValue = (value) => {
      const text = String(value ?? "");
      const escaped = text.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const csvLines = [
      headers.join(","),
      ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
    ];

    const csvContent = "\uFEFF" + csvLines.join("\n");
    downloadFile(csvContent, getExportFileName("csv"), "text/csv;charset=utf-8;");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
          Tra cứu thay đổi địa giới hành chính
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Kiểm tra địa chỉ cũ – mới theo nghị quyết chính thức
        </p>
      </div>

      {/* Toggle */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-8 bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-4">
          <span
            className={`text-base md:text-lg font-medium transition-colors ${
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
            className={`text-base md:text-lg font-medium transition-colors ${
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
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 bg-white rounded-2xl shadow-lg p-4 md:p-6 relative">
            <input
              type="text"
              placeholder="Gõ tên Xã/Phường (ví dụ: Ea Tam, Phú Lộc, ...)"
              className="border-2 border-gray-200 p-3 md:p-4 flex-1 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm w-full"
              value={keyword}
              onChange={handleQuickSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleQuickSearch();
              }}
            />

            <button
              onClick={handleQuickSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none w-full sm:w-auto whitespace-nowrap"
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
        <div className={`grid grid-cols-1 ${convertType === "newToOld" ? "md:grid-cols-2" : "md:grid-cols-3"} gap-4 md:gap-6 mb-10 bg-white rounded-2xl shadow-lg p-4 md:p-8`}>
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="border-2 border-gray-200 p-3 md:p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors shadow-sm w-full"
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
              className="border-2 border-gray-200 p-3 md:p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors shadow-sm disabled:opacity-50 w-full"
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
            className="border-2 border-gray-200 p-3 md:p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors shadow-sm disabled:opacity-50 w-full"
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
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 md:px-12 py-3 md:py-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none w-full sm:w-auto"
            >
              {loading ? "Đang tra cứu..." : "Tra cứu"}
            </button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      <div className="border-2 border-gray-200 rounded-2xl p-4 md:p-8 bg-white shadow-lg overflow-hidden">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-gray-800">
          Kết Quả Tra Cứu
        </h2>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
          <button
            onClick={handleExportCsv}
            disabled={!results.length || loading}
            className="px-4 py-2 rounded-lg border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportJson}
            disabled={!results.length || loading}
            className="px-4 py-2 rounded-lg border-2 border-indigo-600 text-indigo-700 hover:bg-indigo-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export JSON
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : results.length > 0 ? (
          <div className="space-y-6 md:space-y-8">
            {results.map((mapping, idx) => (
              <div key={idx} className="space-y-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
                {/* Phần thông tin Nghị quyết */}
                {mapping.change && (
                  <div className="bg-yellow-50 text-yellow-800 px-4 md:px-5 py-3 rounded-xl border border-yellow-200 text-sm md:text-base shadow-sm">
                    <p className="font-semibold mb-1">
                      📝 Nghị quyết: {mapping.change.resolution_number} 
                      {mapping.change.effective_date && ` (Hiệu lực: ${new Date(mapping.change.effective_date).toLocaleDateString("vi-VN")})`}
                    </p>
                    <p className="text-yellow-700">{mapping.change.description}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition">
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
                    state={{ mapping }}
                    className="border-2 border-blue-500 text-blue-600 px-4 md:px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition font-medium whitespace-nowrap text-sm md:text-base w-full sm:w-auto text-center"
                  >
                    Chi tiết
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-5 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition">
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
                    state={{ mapping }}
                    className="border-2 border-blue-600 text-blue-700 px-4 md:px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium whitespace-nowrap text-sm md:text-base w-full sm:w-auto text-center"
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