import { Link } from "react-router-dom";
import { useState } from "react";

function Header() {

  const [showMenu, setShowMenu] = useState(false);

  return (

    <header className="bg-white shadow-md">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          AddressLookup
        </Link>

        {/* Menu */}
        <nav className="flex items-center gap-8 text-gray-700 font-medium">

          <Link
            to="/"
            className="hover:text-blue-600 transition"
          >
            Trang chủ
          </Link>

          <Link
            to="/support"
            className="hover:text-blue-600 transition"
          >
            Hỗ trợ
          </Link>

          <Link
            to="/api"
            className="hover:text-blue-600 transition"
          >
            API
          </Link>

          {/* User Dropdown */}
          <div className="relative">

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >

              {/* Icon */}
              <span>👤</span>

              <span>User</span>

            </button>

            {showMenu && (

              <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-lg overflow-hidden">

                <Link
                  to="/login"
                  className="block px-4 py-3 hover:bg-gray-100 transition"
                >
                  🔑 Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="block px-4 py-3 hover:bg-gray-100 transition"
                >
                  📝 Đăng ký
                </Link>

              </div>

            )}

          </div>

        </nav>

      </div>

    </header>

  );
}

export default Header;