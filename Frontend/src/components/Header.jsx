import { Link } from "react-router-dom";
import { useState } from "react";

function Header() {

  const [showMenu, setShowMenu] = useState(false);

  return (

    <header className="sticky top-0 bg-gradient-to-r from-blue-50 to-white shadow-lg border-b border-gray-200 z-50">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
          AddressLookup
        </Link>

        {/* Menu */}
        <nav className="flex items-center gap-10 text-gray-700 font-medium">

          <Link
            to="/"
            className="hover:text-blue-600 transition-colors duration-200 relative group"
          >
            Trang chủ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>

          <Link
            to="/support"
            className="hover:text-blue-600 transition-colors duration-200 relative group"
          >
            Hỗ trợ
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>

          <Link
            to="/api"
            className="hover:text-blue-600 transition-colors duration-200 relative group"
          >
            API
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>

          {/* User Dropdown */}
          <div className="relative">

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 bg-blue-100 hover:bg-blue-200 px-5 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >

              {/* Icon */}
              <span className="text-lg">👤</span>

              <span className="font-medium">User</span>

              <svg className={`w-4 h-4 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>

            </button>

            {showMenu && (

              <div className="absolute right-0 mt-4 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transform transition-all duration-200 ease-out">

                <Link
                  to="/login"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-blue-50 transition-colors duration-200"
                >
                  <span>🔑</span>
                  <span className="font-medium">Đăng nhập</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-blue-50 transition-colors duration-200"
                >
                  <span>📝</span>
                  <span className="font-medium">Đăng ký</span>
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