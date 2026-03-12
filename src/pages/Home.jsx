function Home() {

  return (

    <div className="max-w-6xl mx-auto p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Tra cứu địa chỉ hành chính
      </h1>

      {/* Search Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow mb-10">

        <h2 className="text-xl font-semibold mb-4">
          Khu vực tìm kiếm
        </h2>

        {/* Search components sẽ thêm ở task sau */}
        <div className="h-20 flex items-center justify-center text-gray-500">
          Search components here
        </div>

      </div>

      {/* Result Section */}
      <div className="border p-6 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-4">
          Kết quả tra cứu
        </h2>

        {/* Result list sẽ thêm ở task sau */}
        <div className="h-32 flex items-center justify-center text-gray-500">
          Result list will display here
        </div>

      </div>

    </div>

  );
}

export default Home;