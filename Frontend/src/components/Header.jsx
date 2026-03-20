import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {

  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState(null);

  // Quét quyền Admin ở mọi cấp độ dữ liệu đề phòng cấu trúc API bị lồng ghép
  const isAdmin = user && (
    String(user.role).toLowerCase() === 'admin' ||
    String(user.user?.role).toLowerCase() === 'admin' ||
    String(user.data?.role).toLowerCase() === 'admin'
  );

  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { setUser(null); }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    setShowMenu(false);
    setShowMobileMenu(false);
  };

  return (

    <header className="sticky top-0 bg-gradient-to-r from-blue-50 to-white shadow-lg border-b border-gray-200 z-[9999]">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-4 md:py-5">

        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200">
          AddressLookup
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-10 text-gray-700 font-medium">

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

          {isAdmin && (
            <Link
              to="/admin"
              className="hover:text-blue-600 transition-colors duration-200 relative group"
            >
              Admin
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
            </Link>
          )}

          {/* User Dropdown */}
          <div className="relative">

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 bg-blue-100 hover:bg-blue-200 px-5 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >

              {/* Icon */}
              <span className="text-lg">👤</span>

              <span className="font-medium">
                {user ? (user.username || user.user?.username || user.full_name || "User") : "User"}
              </span>

              <svg className={`w-4 h-4 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>

            </button>

            {showMenu && (

              <div className="absolute right-0 mt-4 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden transform transition-all duration-200 ease-out">

                {user ? (
                  <>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-red-50 text-red-600 transition-colors duration-200"
                    >
                      <span>🚪</span>
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-5 py-4 hover:bg-blue-50 transition-colors duration-200">
                      <span>🔑</span>
                      <span className="font-medium">Đăng nhập</span>
                    </Link>
                    <Link to="/register" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-5 py-4 hover:bg-blue-50 transition-colors duration-200">
                      <span>📝</span>
                      <span className="font-medium">Đăng ký</span>
                    </Link>
                  </>
                )}

              </div>

            )}

          </div>

        </nav>

      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <nav className="md:hidden bg-white border-t border-gray-200 py-4 px-6 flex flex-col gap-4 text-gray-700 font-medium shadow-inner">
          <Link to="/" onClick={() => setShowMobileMenu(false)} className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <Link to="/support" onClick={() => setShowMobileMenu(false)} className="hover:text-blue-600 transition-colors">Hỗ trợ</Link>
          <Link to="/api" onClick={() => setShowMobileMenu(false)} className="hover:text-blue-600 transition-colors">API</Link>
          {isAdmin && <Link to="/admin" onClick={() => setShowMobileMenu(false)} className="hover:text-blue-600 transition-colors">Admin</Link>}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
            {user ? (
              <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors text-left">
                <span>🚪</span> Đăng xuất
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 hover:text-blue-600 transition-colors"><span>🔑</span> Đăng nhập</Link>
                <Link to="/register" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 hover:text-blue-600 transition-colors"><span>📝</span> Đăng ký</Link>
              </>
            )}
          </div>
        </nav>
      )}

    </header>

  );
}

export default Header;