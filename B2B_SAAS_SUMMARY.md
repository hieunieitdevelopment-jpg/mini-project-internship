# 🚀 KIẾN TRÚC HỆ THỐNG B2B SaaS TẠI VN ADDRESS CONVERTER

Tài liệu này không chỉ tổng hợp tính năng, mà còn "mổ xẻ" các **File Code Cốt Lõi**, **Bản chất Kỹ thuật (Under-the-hood)** và **Tư duy Kiến trúc (Mindset)** khi chuyển đổi một API tra cứu bình thường thành một nền tảng Thương mại B2B (Doanh nghiệp bán cho Doanh nghiệp) hoàn chỉnh.

---

## 1. Cấp quyền truy cập bằng API Key (Authentication Core)

### 📌 Bản chất kỹ thuật
Doanh nghiệp khách hàng mang Hệ thống Server của họ đấu nối với API của chúng ta (Server-to-Server). Họ không thể mở trình duyệt, gõ Email và mật khẩu để lấy chuỗi JWT dài ngoằng có thời hạn 1 tiếng được. 
Giải pháp là **API Key tĩnh**. Sinh ra một mã ngẫu nhiên 64 ký tự (VD: `vnk_xyz123...`) gán vĩnh viễn cho tài khoản đó, có thể tra cứu nhanh trong Database.

### 🗂 Các File Cốt Lõi Đã Tạo:
*   `database/create_api_keys_table.sql`: Tạo bảng `api_keys` để lưu trữ mã bảo mật, ngày tạo và trạng thái (active/revoked).
*   `backend/src/models/apiKey.model.js`: Các câu lệnh Postgres (SQL) đẻ sinh mã ngẫu nhiên qua module `crypto` lõi của NodeJS.
*   `backend/src/controllers/apiKey.controller.js`: Xử lý Logic — Đếm số lượng API Key của User (Giới hạn tối đa 3 Keys), trả về Frontend giao diện ẩn (Mask: `vnk_***********1234`).
*   `Frontend/src/pages/DeveloperPortal.jsx`: Giao diện React hiển thị quản lý Key để người dùng "Tự phục vụ" (Self-service). Nó sinh ra tâm lý chuyên nghiệp cho khách hàng giống y như họ đi dùng của Google hay OpenAI.

---

## 2. Bảo Mật Xác Thực Nhận Diện Khách (Hybrid Auth)

### 📌 Bản chất kỹ thuật
Tại sao làm SaaS lại khó? Vì **cùng một đường link API** (VD: `/api/v1/provinces`), bạn phải thỏa mãn 3 loại khách:
1. Bạn (Admin/User) lên Web bấm bấm -> Hệ thống gửi `Bearer Token` (JWT).
2. App Giao hàng (B2B) lập trình ngầm -> Hệ thống gửi Header `x-api-key`.
3. Khách lướt web ẩn danh (Guest) -> Gọi API "trần trụi".
**Giải pháp:** Viết một "Trạm gác thông minh" (Middleware) không đuổi cổ Guest, mà nhận diện chúng để phân luồng.

### 🗂 Các File Cốt Lõi Đã Sửa:
*   `backend/src/middlewares/auth.middleware.js` (Thêm hàm `optionalAuth`):
    *   **Cơ chế:** Hàm này check `req.headers["authorization"]` (JWT) trước. Nếu lỗi thì check tiếp `req.headers["x-api-key"]` (API Key bằng cách móc DB).
    *   Nếu tìm thấy thông tin -> Gán thẻ `req.user = { id, authType: 'api_key' / 'jwt' }`. 
    *   Nếu không có cả 2 -> Gán `req.user = { authType: 'none' }` (Cho đi qua nhưng bị dán nhãn "Khách Vãng Lai").

---

## 3. Khóa Van Chống Sập & Hút Máu (Rate Limiting với Redis)

### 📌 Bản chất kỹ thuật
Server gửi dữ liệu tính bằng ms, do đó nếu có 10 Vòng lặp `for` chạy cùng lúc, DB sẽ nghẽn. Nếu là Guest phá hoại, họ sẽ làm sập máy chủ (DDoS). Nếu là Đối tác B2B, họ xài "chùa" hàng triệu request mà bạn không thu được xu nào.
**Giải pháp:** Thuật toán **Sliding Window Counter** bằng RAM (Redis). Redis hoạt động trên RAM thay vì Ổ cứng (Postgres), nên tốc độ đếm lùi số lượng Request bằng tính bằng micro-giây. Phân cấp bậc đếm: B2B(100) > JWT(60) > Guest(30).

### 🗂 Các File Cốt Lõi Đã Tạo/Sửa:
*   `backend/src/config/redis.js`: Cầu nối NodeJS với CSDL Redis. Cơ chế Fail-Open: Đề phòng Redis sập, server vẫn cứ cho request lọt qua chứ không làm ảnh hưởng Web.
*   `backend/src/middlewares/rateLimiter.js`: Middleware đo đếm.
    *   Tự động sinh **Khóa đếm (Key)** trên Redis: Nếu là B2B(Dùng api_key), nếu là Guest(Dùng địa chỉ IP).
    *   Sau mỗi phút (60s), Redis tự động Hủy `(EXPIRE)` khối lượng đếm để Reset hệ thống.
    *   Gắn các Response Header: `X-RateLimit-Limit`, `X-RateLimit-Remaining` để trả về cho máy của đối tác, đối tác tự biết được "Á đù, mình chỉ còn 5 lượt gọi API nữa là đầy".

---

## 4. Cuốn Sổ Tính Tiền Tự Động (Usage Analytics)

### 📌 Bản chất kỹ thuật
Làm sao để biết đối tác dùng bao nhiêu mà gửi hóa đơn thu tiền vào ngày 30? Việc ghi chú Log vào Database cần thời gian (vì đĩa cứng quay chậm). Nếu bắt User "đợi ghi chú xong mới trả về dữ liệu Địa chỉ" thì máy chủ lại quá chậm.
**Giải pháp Kỹ thuật đỉnh cao:** Event Hook ngầm (Fire-and-forget). API cứ chạy thật nhanh đi, ngay tại giây phút Gửi Dữ liệu thành công, sẽ phát sinh một tín hiệu báo cho thợ ghi chép âm thầm chép vào sổ lùi lại đằng sau!

### 🗂 Các File Cốt Lõi Đã Tạo:
*   `backend/database/create_api_usage_logs_table.sql`: Lập cái bảng `api_usage_logs` ghi rõ Ai, Endpoint nào, Thời gian phản hồi, IP, Trình duyệt. **Cơ chế:** Đánh Index cực nặng trên Cột "created_at" và "api_key_id" để lúc User ấn xem biểu đồ thì Data ra trong tíc-tắc.
*   `backend/src/middlewares/usageLogger.js`: 
    *   **Bản chất Dòng code huyền thoại:** `res.on("finish", async () => {...})`. Lắng nghe lúc hệ thống xong xuôi rảnh rỗi mới xử lý Log chèn vào Database. 
*   `Frontend/src/pages/DeveloperPortal.jsx`: Thêm Recharts. Biểu đồ đường (Line Chart) 30 ngày. Tạo động lực cho khách hàng vì họ thấy rõ dữ liệu trực quan "App của mình hoạt động tốt".

---

## 5. Tài liệu Bán Hàng chuẩn Mỹ (Swagger API Docs)

### 📌 Bản chất kỹ thuật
Kỹ sư đối tác không đọc Code của chúng ta, họ đọc Doc. Nếu gửi file PDF họ sẽ đọc sai và ghép nối API trật lất. Swagger UI là bộ chuẩn toàn cầu để Tester/Dev bên B2B nhấp vào thử (Test) ngay trực tiếp không cần viết Code.

### 🗂 Các File Cốt Lõi Đã Sửa:
*   `backend/src/config/swagger.js`: Cập nhật Security Definition `ApiKeyAuth` chuẩn Swagger OpenAPI 3.0. Cho phép hiển thị ra một ô "Authorze => x-api-key" to dõng dạc.
*   `backend/src/routes/*.js`: Gắn cái thẻ bảo vệ `security: - ApiKeyAuth: []` bằng Comment (`@swagger`) ở trên từng API Route một.

---

## 🎯 BỨC TRANH DIỄN BIẾN (Workflow) 1 REQUEST KHI CHẠY THỰC TẾ
Khi 1 Công ty Giao hàng gọi API `/api/v1/provinces` qua hệ thống Bằng mã Key:

1. **Gate 1 (Auth):** `optionalAuth.js` chộp được mã `x-api-key`, xuống hầm bắt Database xác minh -> Hợp lệ! Đóng mác Dán giấy Thông quan `authType: api_key`.
2. **Gate 2 (Rate Limit):** `rateLimiter.js` nhận diện Giấy Thông Quan, nhảy qua hỏi RAM `Redis`: "Ehe anh bạn này dùng bao nhiêu rồi bồ?" -> Redis đáp: "Mới 5 lần / 1 phút. Dưới 100!" -> Duỗi rào chắn cho bay qua!
3. **Gate 3 (Controller):** Lấy dữ liệu Tỉnh bằng Postgres DB xử lý rẹt rẹt.
4. **Gate 4 (Response):** Đẩy cái kết quả trả ngược về Server của bên Công ty mua hàng, kết thúc phiên chạy HTTP.
5. **Gate 5 Ngầm (Log):** Cửa cuối (Finish Line). Trigger sự kiện âm thầm gọi `usageLogger.js`: "Ê, Phi vụ thành công, thời gian mất `42ms`, của tay Công ty kia. Gắn xuống Sổ Kế Toán!".

Thế là XONG. Đây là bộ lõi tuyệt đối tiêu chuẩn của một Doanh Nghiệp SaaS. Cổng API B2B của bạn hiện nay đang không khác gì cái cổng Cấp Mầm (Startup Tier) của chính Google Maps / OpenAI.
