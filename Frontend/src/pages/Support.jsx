function Support() {

  const faqs = [
    {
      question: "Làm thế nào để tra cứu địa chỉ?",
      answer: "Nhập địa chỉ cũ vào ô tìm kiếm và nhấn Tra cứu. Hệ thống sẽ hiển thị địa chỉ mới tương ứng."
    },
    {
      question: "Dữ liệu có chính xác không?",
      answer: "Dữ liệu được cập nhật theo nghị quyết chính thức của chính phủ về thay đổi địa giới hành chính."
    },
    {
      question: "Tôi có thể sử dụng API không?",
      answer: "Có, chúng tôi cung cấp API để tích hợp vào hệ thống của bạn. Liên hệ để biết thêm chi tiết."
    },
    {
      question: "Làm sao để liên hệ hỗ trợ?",
      answer: "Gửi email đến khaiskylove45@gmail.com hoặc gọi hotline 0388985684."
    }
  ];

  return (

    <div className="max-w-6xl mx-auto p-4 md:p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Hỗ Trợ
        </h1>
        <p className="text-base md:text-lg text-gray-600">
          Câu hỏi thường gặp và thông tin liên hệ
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 mb-8 md:mb-10">

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span>📞</span>
          Liên Hệ Chúng Tôi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Email Hỗ Trợ</h3>
            <p className="text-gray-600">khaiskylove45@gmail.com</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Hotline</h3>
            <p className="text-gray-600">0388985684</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Giờ Làm Việc</h3>
            <p className="text-gray-600">8:00 - 18:00 (Thứ 2 - Thứ 6)</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Địa Chỉ</h3>
            <p className="text-gray-600">301 Huy Cận, TP. Đà Nẵng</p>
          </div>

        </div>

        {/* Map Section */}
        <div className="mt-8 rounded-xl overflow-hidden h-64 sm:h-80 shadow-inner border border-gray-200">
          <iframe
            title="Bản đồ vị trí"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=301%20Huy%20C%E1%BA%ADn,%20%C4%90%C3%A0%20N%E1%BA%B5ng&t=&z=16&ie=UTF8&iwloc=&output=embed"
          ></iframe>
        </div>

      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8">

        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span>❓</span>
          Câu Hỏi Thường Gặp
        </h2>

        <div className="space-y-6">

          {faqs.map((faq, index) => (

            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">

              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {faq.question}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default Support;