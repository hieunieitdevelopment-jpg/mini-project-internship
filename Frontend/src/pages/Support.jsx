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
      answer: "Gửi email đến support@addresslookup.com hoặc gọi hotline 1900-xxxx."
    }
  ];

  return (

    <div className="max-w-6xl mx-auto p-10 bg-gradient-to-br from-blue-50 to-white min-h-screen pt-20">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Hỗ Trợ
        </h1>
        <p className="text-lg text-gray-600">
          Câu hỏi thường gặp và thông tin liên hệ
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <span>📞</span>
          Liên Hệ Chúng Tôi
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Email Hỗ Trợ</h3>
            <p className="text-gray-600">support@addresslookup.com</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Hotline</h3>
            <p className="text-gray-600">1900-XXXX</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Giờ Làm Việc</h3>
            <p className="text-gray-600">8:00 - 18:00 (Thứ 2 - Thứ 6)</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Địa Chỉ</h3>
            <p className="text-gray-600">123 Đường ABC, Quận XYZ, TP.HCM</p>
          </div>

        </div>

      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
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