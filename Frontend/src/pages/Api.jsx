function Api() {

  const apiGroups = [
    {
      category: "Xác Thực (Authentication)",
      endpoints: [
        {
          method: "POST",
          path: "/auth/login",
          description: "Đăng nhập hệ thống và nhận JWT Token",
          params: "Body: { email, password }",
          example: 'POST /auth/login'
        },
        {
          method: "POST",
          path: "/auth/register",
          description: "Đăng ký tài khoản người dùng mới",
          params: "Body: { username, full_name, email, password, phone }",
          example: 'POST /auth/register'
        }
      ]
    },
    {
      category: "Tra Cứu Địa Giới (Mappings)",
      endpoints: [
        {
          method: "GET",
          path: "/mappings",
          description: "Tra cứu sự thay đổi địa giới hành chính (Cũ -> Mới hoặc Mới -> Cũ)",
          params: "Query: direction (old-to-new | new-to-old), province, district, ward",
          example: "GET /mappings?direction=old-to-new&province=Đắk Lắk&district=Krông Năng&ward=Phú Xuân"
        }
      ]
    },
    {
      category: "Đơn Vị Hành Chính (Units)",
      endpoints: [
        {
          method: "GET",
          path: "/provinces",
          description: "Lấy danh sách tất cả Tỉnh/Thành phố",
          params: "—",
          example: "GET /provinces"
        },
        {
          method: "GET",
          path: "/provinces/{id}/districts",
          description: "Lấy danh sách Huyện/Quận trực thuộc một Tỉnh",
          params: "Path: id (Mã tỉnh)",
          example: "GET /provinces/1/districts"
        },
        {
          method: "GET",
          path: "/districts/{id}/wards",
          description: "Lấy danh sách Xã/Phường trực thuộc một Huyện",
          params: "Path: id (Mã huyện), Query: active (true/false)",
          example: "GET /districts/5/wards?active=true"
        },
        {
          method: "GET",
          path: "/units/suggest",
          description: "Gợi ý tìm kiếm nhanh đơn vị hành chính",
          params: "Query: q (Từ khóa), level (ward/district/province)",
          example: "GET /units/suggest?q=Phú Xuân&level=ward"
        },
        {
          method: "GET",
          path: "/units/{id}",
          description: "Lấy thông tin chi tiết một đơn vị hành chính theo ID",
          params: "Path: id (Mã đơn vị)",
          example: "GET /units/10"
        }
      ]
    }
  ];

  return (

    <div className="max-w-7xl mx-auto p-4 md:p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          API Documentation
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Tài liệu hướng dẫn sử dụng API tra cứu địa chỉ
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8 md:mb-10">

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
          <span>🚀</span>
          Giới Thiệu
        </h2>

        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
          API AddressLookup cung cấp dịch vụ xác thực, quản lý và tra cứu thay đổi địa giới hành chính một cách nhanh chóng, chính xác.
          Dữ liệu được cập nhật tự động theo các nghị quyết chính thức của chính phủ.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 md:p-4 rounded-r-lg break-all">
          <p className="text-blue-800 font-medium text-sm md:text-base">Base URL: /api/v1</p>
        </div>

      </div>

      {/* Authentication */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8 md:mb-10">

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
          <span>🔐</span>
          Xác Thực
        </h2>

        <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
          Các API yêu cầu quyền quản trị (như thêm, sửa, xóa user) cần phải truyền kèm JWT Token thu được sau khi đăng nhập thành công vào header của request.
        </p>

        <div className="bg-gray-100 p-3 md:p-4 rounded-lg font-mono text-xs md:text-sm break-all">
          Authorization: Bearer YOUR_JWT_TOKEN
        </div>

      </div>

      {/* Endpoints */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8 md:mb-10">

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
          <span>📋</span>
          Endpoints
        </h2>

        <div className="space-y-8">

          {apiGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4 md:space-y-6">
              <h3 className="text-lg md:text-xl font-bold text-blue-700 border-b-2 border-blue-100 pb-2">
                {group.category}
              </h3>
              
              {group.endpoints.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 md:mb-4">
                    <span className={`inline-block w-fit px-3 py-1 rounded-lg text-xs md:text-sm font-bold ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm md:text-lg font-mono text-gray-800 break-all bg-white px-2 py-1 rounded border border-gray-200">{endpoint.path}</code>
                  </div>

                  <p className="text-sm md:text-base text-gray-600 mb-3 font-medium">{endpoint.description}</p>

                  <div className="mb-3">
                    <strong className="text-gray-700 text-sm">Parameters:</strong>
                    <code className="ml-2 bg-white border border-gray-200 px-2 py-1 rounded text-xs md:text-sm break-all text-blue-600">{endpoint.params}</code>
                  </div>

                  <div>
                    <strong className="text-gray-700 text-sm">Example:</strong>
                    <div className="mt-2 bg-gray-800 text-green-400 p-3 rounded-lg font-mono text-xs md:text-sm overflow-x-auto shadow-inner">
                      {endpoint.example}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          ))}

        </div>

      </div>

      {/* Response Example */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8 md:mb-10">

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
          <span>📄</span>
          Ví Dụ Response
        </h2>

        <div className="bg-gray-800 text-green-400 p-4 md:p-6 rounded-lg font-mono text-xs md:text-sm overflow-x-auto shadow-inner">
{`{
  "data": [
    {
      "old_unit": {
        "id": 1,
        "name": "Xã Phú Lộc",
        "level": "ward",
        "parent": "Huyện Krông Năng"
      },
      "new_unit": {
        "id": 2,
        "name": "Xã Krông Năng",
        "level": "ward"
      },
      "change": {
        "type": "merge",
        "resolution_number": "1660/NQ-UBTVQH15",
        "effective_date": "2025-07-01T00:00:00.000Z",
        "description": "Sáp nhập toàn bộ DT và dân số của xã Phú Lộc thành xã Krông Năng mới."
      }
    }
  ]
}`}
        </div>

      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8">

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-3">
          <span>⚡</span>
          Giới Hạn Sử Dụng
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

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