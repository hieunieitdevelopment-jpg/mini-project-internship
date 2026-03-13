import { useState } from "react";

function Home() {

  const [keyword, setKeyword] = useState("");
  const [convertType, setConvertType] = useState("oldToNew");
  const [searchMode, setSearchMode] = useState("quick"); // quick | dropdown
  const [showDetail, setShowDetail] = useState(false);

  const result = {
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

      {/* Toggle convert + search mode */}
      <div className="flex justify-center items-center gap-6 mb-6">

        {/* Convert toggle */}
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

        {/* Search mode toggle */}
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
            placeholder="Phường Hòa Thọ Đông, Quận Cẩm Lệ, Thành phố Đà Nẵng"
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
            <option>Thành phố Hà Nội</option>
            <option>Thành phố Hồ Chí Minh</option>
            <option>Thành phố Đà Nẵng</option>
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

      {/* Result */}
      <div className="border rounded-xl p-6 bg-gray-50">

        <h2 className="text-xl font-bold text-center mb-6">
          Kết Quả Tra Cứu
        </h2>

        {/* Old address */}
        <div className="flex justify-between items-center border-b py-4">

          <div>
            <strong>Địa chỉ cũ:</strong> {result.oldAddress}
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => setShowDetail(true)}
              className="border px-3 py-1 rounded"
            >
              Chi tiết
            </button>

            <button className="border px-3 py-1 rounded">
              Sao chép tất cả
            </button>

          </div>

        </div>

        {/* New address */}
        <div className="flex justify-between items-center py-4">

          <div>
            <strong>Địa chỉ mới:</strong> {result.newAddress}
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => setShowDetail(true)}
              className="border px-3 py-1 rounded"
            >
              Chi tiết
            </button>

            <button className="border px-3 py-1 rounded">
              Sao chép tất cả
            </button>

          </div>

        </div>

      </div>

      {/* Detail popup */}
      {showDetail && (

        <div className="fixed right-10 top-32 w-96 bg-white shadow-xl rounded-xl p-6">

          <div className="flex justify-between items-center mb-4">

            <h3 className="text-lg font-bold">
              Chi tiết
            </h3>

            <button
              onClick={() => setShowDetail(false)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Đóng
            </button>

          </div>

          <p className="mb-2">
            <strong>Địa chỉ cũ:</strong> {result.oldAddress}
          </p>

          <p className="mb-2">
            <strong>Địa chỉ mới:</strong> {result.newAddress}
          </p>

          <p className="mb-4">
            <strong>Ngày tra cứu:</strong> {result.date}
          </p>

          <div className="bg-gray-200 h-40 rounded flex items-center justify-center">
            Bản đồ
          </div>

        </div>

      )}

    </div>

  );
}

export default Home;