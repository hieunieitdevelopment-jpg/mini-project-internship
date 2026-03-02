# FRONTEND – HỆ THỐNG TRA CỨU & CHUYỂN ĐỔI ĐỊA CHỈ HÀNH CHÍNH

---

## 1. Giới thiệu

Phần Frontend của project được xây dựng nhằm cung cấp giao diện web cho hệ thống tra cứu và chuyển đổi địa chỉ hành chính trước và sau khi sáp nhập.

Frontend tập trung vào việc:
- Hiển thị dữ liệu một cách rõ ràng, dễ hiểu
- Hỗ trợ người dùng tra cứu địa chỉ nhanh chóng
- Kết nối và làm việc với Backend thông qua REST API

Toàn bộ logic xử lý dữ liệu và nghiệp vụ được thực hiện ở Backend, Frontend không xử lý các bài toán mapping phức tạp.

---

## 2. Mục tiêu của Frontend

- Tạo giao diện web đơn giản, dễ sử dụng cho người dùng phổ thông
- Cho phép nhập và tra cứu địa chỉ hành chính
- Hiển thị kết quả chuyển đổi địa chỉ cũ ↔ địa chỉ mới
- Thực hành kỹ năng xây dựng Frontend trong mô hình FE – BE tách biệt

---

## 3. Vai trò của Frontend trong hệ thống

Frontend đóng vai trò là lớp giao tiếp giữa người dùng và hệ thống, bao gồm:
- Nhận dữ liệu đầu vào từ người dùng
- Gửi request lên Backend thông qua API
- Nhận dữ liệu phản hồi từ Backend
- Hiển thị kết quả và trạng thái lên giao diện

Frontend không lưu trữ dữ liệu hành chính và không can thiệp vào logic xử lý nghiệp vụ.

---

## 4. Các chức năng chính

### 4.1 Tra cứu địa chỉ cũ sang địa chỉ mới

- Người dùng nhập địa chỉ hành chính cũ (xã/phường, huyện, tỉnh)
- Frontend gửi dữ liệu lên Backend
- Hiển thị địa chỉ hành chính mới tương ứng

---

### 4.2 Tra cứu ngược địa chỉ mới sang địa chỉ cũ

- Người dùng nhập địa chỉ hành chính mới
- Frontend hiển thị địa chỉ cũ tương ứng (nếu tồn tại)

---

### 4.3 Hiển thị lịch sử thay đổi

- Hiển thị thông tin thay đổi đơn vị hành chính:
  - Địa chỉ trước sáp nhập
  - Địa chỉ sau sáp nhập
  - Thời điểm thay đổi
  - Hình thức thay đổi (đổi tên, gộp đơn vị)

---

### 4.4 Thông báo và trạng thái

- Hiển thị loading khi đang gọi API
- Thông báo khi không tìm thấy dữ liệu
- Hiển thị lỗi khi Backend trả về lỗi

---

## 5. Luồng xử lý Frontend


Người dùng nhập dữ liệu
↓
Frontend gửi request API
↓
Backend xử lý và trả kết quả
↓
Frontend hiển thị dữ liệu


---

## 6. Giao tiếp với Backend

Frontend sử dụng REST API do Backend cung cấp.

Các API chính được sử dụng:

GET /api/address/convert
GET /api/address/reverse
GET /api/address/history/{id}


Frontend chỉ thực hiện gọi API và hiển thị dữ liệu, không xử lý logic nghiệp vụ.

---

## 7. Cấu trúc thư mục Frontend (dự kiến)


src/
   - pages/ # Các trang chức năng chính
   - components/ # Component giao diện dùng chung
   - services/ # Xử lý gọi API
   - styles/ # CSS / styling
   - App.jsx

---

## 8. Công nghệ sử dụng

- Framework Frontend: React
- Gọi API: Fetch / Axios
- Styling: CSS / Tailwind CSS
- Công cụ build: Vite

---

## 9. Phạm vi và giới hạn

Trong phạm vi thực tập, Frontend:
- Chỉ tập trung vào chức năng tra cứu và hiển thị dữ liệu
- Chưa triển khai đăng nhập và phân quyền người dùng
- Chưa tích hợp bản đồ hoặc các chức năng GIS
- Giao diện ở mức cơ bản, ưu tiên rõ ràng và dễ sử dụng

---

## 10. Khó khăn gặp phải

- Dữ liệu địa chỉ có nhiều trường hợp trùng tên
- Việc hiển thị kết quả sao cho dễ hiểu với người dùng phổ thông
- Phụ thuộc nhiều vào độ chính xác và đầy đủ của dữ liệu từ Backend

---

## 11. Mong muốn nhận góp ý

- Phạm vi Frontend đã phù hợp với thời gian thực tập hay chưa
- Cách tổ chức chức năng và giao diện đã hợp lý chưa
- Có nên bổ sung thêm chức năng Frontend nào để tăng tính thực tiễn của hệ thống
