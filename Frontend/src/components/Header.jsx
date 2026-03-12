import { Link } from "react-router-dom";

function Header() {
  return (

    <header className="bg-gray-800 text-white">

      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">

        {/* Logo */}
        <div className="text-xl font-bold">
          MyWebsite
        </div>

        {/* Menu */}
        <nav className="space-x-6">

          <Link to="/" className="hover:text-gray-300">
            Trang chủ
          </Link>

          <Link to="/support" className="hover:text-gray-300">
            Hỗ trợ
          </Link>

          <Link to="/api" className="hover:text-gray-300">
            API
          </Link>

          <Link to="/user" className="hover:text-gray-300">
            User
          </Link>

        </nav>

      </div>

    </header>

  );
}

export default Header;