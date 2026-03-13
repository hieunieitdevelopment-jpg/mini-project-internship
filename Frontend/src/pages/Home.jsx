import { useState } from "react";

function Home() {
  
  const [keyword, setKeyword] = useState("");
  const [convertType, setConvertType] = useState("oldToNew");
  const [searchMode, setSearchMode] = useState("quick");

  return (

    <div className="max-w-6xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Tra cứu địa chỉ hành chính
      </h1>

      {/* Search Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Tra cứu địa chỉ
        </h2>

        {/* Convert Toggle */}
        <div className="flex gap-4 mb-4">

          <button
            className={`px-4 py-2 rounded ${
              convertType === "oldToNew"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setConvertType("oldToNew")}
          >
            Cũ → Mới
          </button>

          <button
            className={`px-4 py-2 rounded ${
              convertType === "newToOld"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setConvertType("newToOld")}
          >
            Mới → Cũ
          </button>

        </div>

        {/* Search Mode Toggle */}
        <div className="flex gap-4 mb-4">

          <button
            className={`px-4 py-2 rounded ${
              searchMode === "quick"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSearchMode("quick")}
          >
            Tìm kiếm nhanh
          </button>

          <button
            className={`px-4 py-2 rounded ${
              searchMode === "dropdown"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setSearchMode("dropdown")}
          >
            Tìm theo Dropdown
          </button>

        </div>

        {/* QUICK SEARCH */}
        {searchMode === "quick" && (

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Nhập địa chỉ cần tra cứu..."
              className="border p-2 flex-1 rounded"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Tìm kiếm
            </button>

          </div>

        )}

        {/* DROPDOWN SEARCH */}
        {searchMode === "dropdown" && (

          <div className="grid grid-cols-3 gap-3">

            <select className="border p-2 rounded">
              <option>Tỉnh / Thành phố</option>
              <option>Đà Nẵng</option>
              <option>Hà Nội</option>
              <option>TP Hồ Chí Minh</option>
            </select>

            <select className="border p-2 rounded">
              <option>Quận / Huyện</option>
            </select>

            <select className="border p-2 rounded">
              <option>Phường / Xã</option>
            </select>

          </div>

        )}

      </div>

      {/* Result Section */}
      <div className="border p-6 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-4">
          Kết quả tra cứu
        </h2>

        <div className="space-y-3">

          <div className="border p-3 rounded">
            <strong>Địa chỉ cũ:</strong> ---
          </div>

          <div className="border p-3 rounded">
            <strong>Địa chỉ mới:</strong> ---
          </div>

          <div className="border p-3 rounded">
            <strong>Tỉnh/Thành phố:</strong> ---
          </div>

          <div className="border p-3 rounded">
            <strong>Quận/Huyện:</strong> ---
          </div>

          <div className="border p-3 rounded">
            <strong>Phường/Xã:</strong> ---
          </div>

        </div>

      </div>

    </div>

  );
}

export default Home;