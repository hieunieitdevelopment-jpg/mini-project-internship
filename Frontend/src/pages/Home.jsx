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

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const res = await fetch('http://44.202.66.188:3000/api/v1/address/provinces');
      const data = await res.json();
      setProvinces(data.data || []);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    setSelectedProvince(id);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    if (id) fetchDistricts(id);
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const res = await fetch(`http://44.202.66.188:3000/api/v1/address/districts?provinceId=${provinceId}`);
      const data = await res.json();
      setDistricts(data.data || []);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    setSelectedDistrict(id);
    setSelectedWard("");
    setWards([]);
    if (id) fetchWards(id);
  };

  const fetchWards = async (districtId) => {
    try {
      const res = await fetch(`http://44.202.66.188:3000/api/v1/address/wards?districtId=${districtId}`);
      const data = await res.json();
      setWards(data.data || []);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleSearch = async () => {
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      alert("Vui lòng chọn đầy đủ Tỉnh, Huyện, Xã.");
      return;
    }
    setLoading(true);
    const province = provinces.find(p => p.id == selectedProvince)?.name;
    const district = districts.find(d => d.id == selectedDistrict)?.name;
    const ward = wards.find(w => w.id == selectedWard)?.name;
    const url = convertType === "oldToNew" 
      ? `http://44.202.66.188:3000/api/v1/address/convert/old-to-new?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}&ward=${encodeURIComponent(ward)}`
      : `http://44.202.66.188:3000/api/v1/address/convert/new-to-old?province=${encodeURIComponent(province)}&district=${encodeURIComponent(district)}&ward=${encodeURIComponent(ward)}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.data || []);
    } catch (error) {
      console.error('Error converting address:', error);
      alert("Có lỗi xảy ra khi tra cứu.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="max-w-6xl mx-auto p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen pt-20">

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Tra cứu thay đổi địa giới hành chính
        </h1>
        <p className="text-lg text-gray-600">
          Kiểm tra địa chỉ cũ – mới theo nghị quyết chính thức
        </p>
      </div>

      {/* Toggle convert */}
      <div className="flex justify-center items-center gap-8 mb-8 bg-white rounded-2xl shadow-lg p-6">

        <div className="flex items-center gap-4">

          <span className={`text-lg font-medium transition-colors ${convertType === "oldToNew" ? "text-blue-600" : "text-gray-500"}`}>
            Cũ → Mới
          </span>

          <button
            className={`w-16 h-8 rounded-full flex items-center px-1 transition-all duration-300 shadow-inner
            ${convertType === "oldToNew" ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={() =>
              setConvertType(
                convertType === "oldToNew" ? "newToOld" : "oldToNew"
              )
            }
          >
            <div
              className={`bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md
              ${convertType === "oldToNew" ? "" : "translate-x-8"}`}
            />
          </button>

          <span className={`text-lg font-medium transition-colors ${convertType === "newToOld" ? "text-blue-600" : "text-gray-500"}`}>
            Mới → Cũ
          </span>

        </div>

        {/* đổi kiểu search */}
        <button
          onClick={() =>
            setSearchMode(searchMode === "quick" ? "dropdown" : "quick")
          }
          className="border-2 border-gray-300 rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 shadow-sm"
        >
          🔄
        </button>

      </div>

      {/* QUICK SEARCH */}
      {searchMode === "quick" && (

        <div className="flex gap-4 mb-10 bg-white rounded-2xl shadow-lg p-6">

          <input
            type="text"
            placeholder="Nhập địa chỉ..."
            className="border-2 border-gray-200 p-4 flex-1 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Tra cứu
          </button>

        </div>

      )}

      {/* DROPDOWN SEARCH */}
      {searchMode === "dropdown" && (

        <div className="grid grid-cols-3 gap-6 mb-10 bg-white rounded-2xl shadow-lg p-8">

          <select 
            value={selectedProvince} 
            onChange={handleProvinceChange}
            className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm"
          >
            <option value="">--Chọn Tỉnh/Thành phố--</option>
            {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <select 
            value={selectedDistrict} 
            onChange={handleDistrictChange}
            className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm"
            disabled={!selectedProvince}
          >
            <option value="">--Quận/Huyện--</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>

          <select 
            value={selectedWard} 
            onChange={handleWardChange}
            className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm"
            disabled={!selectedDistrict}
          >
            <option value="">--Phường/Xã--</option>
            {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>

          <div className="col-span-3 text-center mt-4">
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-12 py-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? "Đang tra cứu..." : "Tra cứu"}
            </button>
          </div>

        </div>

      )}

      {/* RESULT */}
      <div className="border-2 border-gray-200 rounded-2xl p-8 bg-white shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Kết Quả Tra Cứu
        </h2>

        {results.length > 0 ? (
          <div className="space-y-6">
            {results.map((res, index) => (
              <div key={index}>
                <div className="flex justify-between items-center py-6 px-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200 mb-4">
                  <div className="flex-1">
                    <strong className="text-gray-700">Địa chỉ cũ:</strong>
                    <p className="text-gray-600 mt-1">{res.old_unit.name}, {res.old_unit.parent}, {res.old_unit.grandparent}</p>
                  </div>
                  <Link
                    to={`/address/${res.old_unit.id}`}
                    className="border-2 border-blue-500 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Chi tiết
                  </Link>
                </div>

                <div className="flex justify-between items-center py-6 px-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex-1">
                    <strong className="text-gray-700">Địa chỉ mới:</strong>
                    <p className="text-gray-600 mt-1">{res.new_unit.name}, {res.new_unit.parent}, {res.new_unit.grandparent}</p>
                  </div>
                  <Link
                    to={`/address/${res.new_unit.id}`}
                    className="border-2 border-blue-500 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Chưa có kết quả. Vui lòng chọn địa chỉ và tra cứu.</p>
        )}

      </div>

    </div>

  );
}

export default Home;