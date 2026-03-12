import { useState } from "react";

function Home() {

  const [keyword, setKeyword] = useState("");
  const [convertType, setConvertType] = useState("oldToNew");

  return (

    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-center mb-8">
        Tra cứu địa chỉ hành chính
      </h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Tìm kiếm nhanh
        </h2>

        {/* Toggle Convert */}
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

        {/* Search Input */}
        <input
          type="text"
          placeholder="Nhập địa chỉ cần tra cứu..."
          className="border p-2 w-full rounded"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

      </div>

      <div className="border p-6 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-4">
          Kết quả tra cứu
        </h2>

        <div className="text-gray-500">
          Result list will display here
        </div>

      </div>

    </div>
  );
}

export default Home;