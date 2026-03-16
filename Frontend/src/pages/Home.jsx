import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {

  const [keyword, setKeyword] = useState("");
  const [convertType, setConvertType] = useState("oldToNew");
  const [searchMode, setSearchMode] = useState("quick");

  // mock data (sau này sẽ lấy từ API)
  const result = {
    id: 1,
    oldAddress: "Phường Hòa Thọ Đông, Quận Cẩm Lệ, Thành phố Đà Nẵng",
    newAddress: "Phường Cẩm Lệ, Thành phố Đà Nẵng",
    date: "03/10/2026"
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

          <select className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm">
            <option>--Chọn Tỉnh/Thành phố--</option>
            <option>Đà Nẵng</option>
            <option>Hà Nội</option>
            <option>TP Hồ Chí Minh</option>
          </select>

          <select className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm">
            <option>--Quận/Huyện--</option>
          </select>

          <select className="border-2 border-gray-200 p-4 rounded-xl focus:border-blue-400 focus:outline-none transition-colors duration-200 shadow-sm">
            <option>--Phường/Xã--</option>
          </select>

          <div className="col-span-3 text-center mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Tra cứu
            </button>
          </div>

        </div>

      )}

      {/* RESULT */}
      <div className="border-2 border-gray-200 rounded-2xl p-8 bg-white shadow-lg">

        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Kết Quả Tra Cứu
        </h2>

        <div className="space-y-6">

          <div className="flex justify-between items-center py-6 px-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">

            <div className="flex-1">
              <strong className="text-gray-700">Địa chỉ cũ:</strong>
              <p className="text-gray-600 mt-1">{result.oldAddress}</p>
            </div>

            <Link
              to={`/address/${result.id}`}
              className="border-2 border-blue-500 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Chi tiết
            </Link>

          </div>

          <div className="flex justify-between items-center py-6 px-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">

            <div className="flex-1">
              <strong className="text-gray-700">Địa chỉ mới:</strong>
              <p className="text-gray-600 mt-1">{result.newAddress}</p>
            </div>

            <Link
              to={`/address/${result.id}`}
              className="border-2 border-blue-500 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Chi tiết
            </Link>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Home;