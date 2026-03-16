function Admin() {

  const users = [
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "User", status: "Active" },
    { id: 2, name: "Trần Thị B", email: "b@example.com", role: "Admin", status: "Active" },
    { id: 3, name: "Lê Văn C", email: "c@example.com", role: "User", status: "Inactive" },
    { id: 4, name: "Phạm Thị D", email: "d@example.com", role: "User", status: "Active" },
  ];

  return (

    <div className="max-w-7xl mx-auto p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen pt-20">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Quản Lý Người Dùng
        </h1>
        <p className="text-lg text-gray-600">
          Quản lý tài khoản người dùng hệ thống
        </p>
      </div>

      {/* Add User Button */}
      <div className="mb-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          ➕ Thêm Người Dùng Mới
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            Danh Sách Người Dùng
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Tên</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Vai Trò</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Hành Động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">

              {users.map((user) => (

                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">

                  <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>

                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>

                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex gap-2">
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200">
                        Sửa
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200">
                        Xóa
                      </button>
                    </div>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>

      </div>

    </div>

  );
}

export default Admin;