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

    <div className="max-w-6xl mx-auto p-10">

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-2">
        Tra cứu thay đổi địa giới hành chính
      </h1>

      <p className="text-center text-gray-500 mb-6">
        Kiểm tra địa chỉ cũ – mới theo nghị quyết chính thức
      </p>

      {/* Toggle convert */}
      <div className="flex justify-center items-center gap-6 mb-6">

        <div className="flex items-center gap-3">

          <span className={convertType === "oldToNew" ? "font-semibold" : ""}>
            Cũ → Mới
          </span>

          <button
            className={`w-14 h-7 rounded-full flex items-center px-1 transition
            ${convertType === "oldToNew" ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={() =>
              setConvertType(
                convertType === "oldToNew" ? "newToOld" : "oldToNew"
              )
            }
          >
            <div
              className={`bg-white w-5 h-5 rounded-full transition
              ${convertType === "oldToNew" ? "" : "translate-x-7"}`}
            />
          </button>

          <span className={convertType === "newToOld" ? "font-semibold" : ""}>
            Mới → Cũ
          </span>

        </div>

        {/* đổi kiểu search */}
        <button
          onClick={() =>
            setSearchMode(searchMode === "quick" ? "dropdown" : "quick")
          }
          className="border rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
        >
          🔄
        </button>

      </div>

      {/* QUICK SEARCH */}
      {searchMode === "quick" && (

        <div className="flex gap-3 mb-8">

          <input
            type="text"
            placeholder="Nhập địa chỉ..."
            className="border p-3 flex-1 rounded-lg"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          <button className="bg-blue-600 text-white px-6 rounded-lg">
            Tra cứu
          </button>

        </div>

      )}

      {/* DROPDOWN SEARCH */}
      {searchMode === "dropdown" && (

        <div className="grid grid-cols-3 gap-4 mb-8">

          <select className="border p-3 rounded-lg">
            <option>--Chọn Tỉnh/Thành phố--</option>
            <option>Đà Nẵng</option>
            <option>Hà Nội</option>
            <option>TP Hồ Chí Minh</option>
          </select>

          <select className="border p-3 rounded-lg">
            <option>--Quận/Huyện--</option>
          </select>

          <select className="border p-3 rounded-lg">
            <option>--Phường/Xã--</option>
          </select>

          <div className="col-span-3 text-center">
            <button className="bg-blue-600 text-white px-10 py-2 rounded-lg">
              Tra cứu
            </button>
          </div>

        </div>

      )}

      {/* RESULT */}
      <div className="border rounded-xl p-6 bg-gray-50">

        <h2 className="text-xl font-bold text-center mb-6">
          Kết Quả Tra Cứu
        </h2>

        <div className="flex justify-between items-center py-4 border-b">

          <div>
            <strong>Địa chỉ cũ:</strong> {result.oldAddress}
          </div>

          <Link
            to={`/address/${result.id}`}
            className="border px-3 py-1 rounded hover:bg-gray-100"
          >
            Chi tiết
          </Link>

        </div>

        <div className="flex justify-between items-center py-4">

          <div>
            <strong>Địa chỉ mới:</strong> {result.newAddress}
          </div>

          <Link
            to={`/address/${result.id}`}
            className="border px-3 py-1 rounded hover:bg-gray-100"
          >
            Chi tiết
          </Link>

        </div>

      </div>

    </div>

  );
}

export default Home;