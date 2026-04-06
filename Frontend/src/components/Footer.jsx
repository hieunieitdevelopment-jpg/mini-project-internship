function Footer() {

  return (

    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="col-span-1">

            <h3 className="text-xl font-bold mb-4 text-blue-100 flex items-center gap-2">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              TraCứuĐịaGiới
            </h3>

            <p className="text-blue-200 leading-relaxed">
              Dịch vụ tra cứu thay đổi địa giới hành chính chính xác và nhanh chóng.
            </p>

          </div>

          {/* Quick Links */}
          <div>

            <h4 className="text-lg font-semibold mb-4 text-blue-100">Liên Kết Nhanh</h4>

            <ul className="space-y-2">

              <li><a href="/" className="text-blue-200 hover:text-white transition-colors">Trang Chủ</a></li>

              <li><a href="/support" className="text-blue-200 hover:text-white transition-colors">Hỗ Trợ</a></li>

              <li><a href="/api" className="text-blue-200 hover:text-white transition-colors">API</a></li>

              <li><a href="/admin" className="text-blue-200 hover:text-white transition-colors">Admin</a></li>

            </ul>

          </div>

          {/* Services */}
          <div>

            <h4 className="text-lg font-semibold mb-4 text-blue-100">Dịch Vụ</h4>

            <ul className="space-y-2">

              <li className="text-blue-200">Tra Cứu Địa Chỉ</li>

              <li className="text-blue-200">API Integration</li>

              <li className="text-blue-200">Báo Cáo Thống Kê</li>

              <li className="text-blue-200">Hỗ Trợ Kỹ Thuật</li>

            </ul>

          </div>

          {/* Contact */}
          <div>

            <h4 className="text-lg font-semibold mb-4 text-blue-100">Liên Hệ</h4>

            <div className="space-y-2 text-blue-200">

              <p>📧 support@addresslookup.com</p>

              <p>📞 1900-XXXX</p>

              <p>📍 123 Đường ABC, TP.HCM</p>

            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">

          <p className="text-blue-300 text-sm text-center md:text-left">
            © 2026 TraCứuĐịaGiới. Tất cả quyền được bảo lưu.
          </p>

          <div className="flex space-x-4 md:space-x-6 mt-4 md:mt-0">

            <a href="#" className="text-blue-300 hover:text-white transition-colors text-sm">Điều Khoản</a>

            <a href="#" className="text-blue-300 hover:text-white transition-colors text-sm">Bảo Mật</a>

            <a href="#" className="text-blue-300 hover:text-white transition-colors text-sm">Cookie</a>

          </div>

        </div>

      </div>

    </footer>

  );
}

export default Footer;