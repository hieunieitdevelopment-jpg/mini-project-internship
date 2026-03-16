function Api() {

  const endpoints = [
    {
      method: "GET",
      path: "/api/addresses",
      description: "Tra cứu địa chỉ cũ - mới",
      params: "q: địa chỉ cần tra cứu",
      example: "GET /api/addresses?q=Phường Hòa Thọ Đông, Đà Nẵng"
    },
    {
      method: "GET",
      path: "/api/addresses/{id}",
      description: "Lấy chi tiết địa chỉ theo ID",
      params: "id: ID của địa chỉ",
      example: "GET /api/addresses/1"
    },
    {
      method: "POST",
      path: "/api/addresses/batch",
      description: "Tra cứu nhiều địa chỉ cùng lúc",
      params: "addresses: mảng địa chỉ",
      example: "POST /api/addresses/batch"
    }
  ];

  return (

    <div className="max-w-7xl mx-auto p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen pt-20">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          API Documentation
        </h1>
        <p className="text-lg text-gray-600">
          Tài liệu hướng dẫn sử dụng API tra cứu địa chỉ
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span>🚀</span>
          Giới Thiệu
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4">
          API AddressLookup cung cấp dịch vụ tra cứu thay đổi địa giới hành chính một cách nhanh chóng và chính xác.
          Dữ liệu được cập nhật theo nghị quyết chính thức của chính phủ.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-blue-800 font-medium">Base URL: https://api.addresslookup.com</p>
        </div>

      </div>

      {/* Authentication */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span>🔐</span>
          Xác Thực
        </h2>

        <p className="text-gray-600 leading-relaxed mb-4">
          Để sử dụng API, bạn cần đăng ký tài khoản và lấy API Key.
        </p>

        <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
          Authorization: Bearer YOUR_API_KEY
        </div>

      </div>

      {/* Endpoints */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span>📋</span>
          Endpoints
        </h2>

        <div className="space-y-6">

          {endpoints.map((endpoint, index) => (

            <div key={index} className="border border-gray-200 rounded-xl p-6">

              <div className="flex items-center gap-4 mb-4">

                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {endpoint.method}
                </span>

                <code className="text-lg font-mono text-gray-800">{endpoint.path}</code>

              </div>

              <p className="text-gray-600 mb-3">{endpoint.description}</p>

              <div className="mb-3">
                <strong className="text-gray-700">Parameters:</strong>
                <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">{endpoint.params}</code>
              </div>

              <div>
                <strong className="text-gray-700">Example:</strong>
                <div className="mt-2 bg-gray-100 p-3 rounded-lg font-mono text-sm">
                  {endpoint.example}
                </div>
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Response Example */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span>📄</span>
          Ví Dụ Response
        </h2>

        <div className="bg-gray-100 p-6 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    "oldAddress": "Phường Hòa Thọ Đông, Quận Cẩm Lệ, TP Đà Nẵng",
    "newAddress": "Phường Cẩm Lệ, TP Đà Nẵng",
    "date": "03/10/2026"
  }
}`}
        </div>

      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span>⚡</span>
          Giới Hạn Sử Dụng
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Free Plan</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• 100 requests/day</li>
              <li>• 10 requests/minute</li>
              <li>• Basic support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Premium Plan</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• 10,000 requests/day</li>
              <li>• 100 requests/minute</li>
              <li>• Priority support</li>
              <li>• Batch processing</li>
            </ul>
          </div>

        </div>

      </div>

    </div>

  );
}

export default Api;