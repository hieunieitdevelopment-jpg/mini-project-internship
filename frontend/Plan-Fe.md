**# FRONTEND – HỆ THỐNG TRA CỨU & CHUYỂN ĐỔI ĐỊA CHỈ HÀNH CHÍNH

## Tổng quan
Phần Frontend của hệ thống được xây dựng nhằm cung cấp giao diện web cho việc tra cứu và chuyển đổi địa chỉ hành chính trước và sau khi sáp nhập.  
Frontend đóng vai trò là lớp giao tiếp giữa người dùng và Backend, không xử lý các logic nghiệp vụ phức tạp.

Nội dung được trình bày theo mô hình **OKR (Objective – Key Results)**, mỗi mục tiêu gồm **4 kết quả then chốt**.

---

## Objective 1: Xây dựng giao diện web phục vụ tra cứu địa chỉ hành chính
**Mục tiêu:**  
Tạo giao diện Frontend đơn giản, trực quan, dễ sử dụng cho người dùng phổ thông.

**Key Results:**  
1. Giao diện hiển thị rõ ràng, dễ đọc, bố cục hợp lý  
2. Người dùng có thể nhập thông tin địa chỉ hành chính nhanh chóng  
3. Kết quả tra cứu được trình bày đầy đủ và dễ hiểu  
4. Ứng dụng hoạt động ổn định trên các trình duyệt web phổ biến  

---

## Objective 2: Thực hiện chức năng tra cứu và chuyển đổi địa chỉ thông qua Backend
**Mục tiêu:**  
Đảm bảo Frontend kết nối hiệu quả với Backend để thực hiện chuyển đổi địa chỉ hành chính.

**Key Results:**  
1. Gửi request tra cứu địa chỉ cũ sang địa chỉ mới thông qua API  
2. Gửi request tra cứu địa chỉ mới sang địa chỉ cũ thông qua API  
3. Nhận dữ liệu phản hồi từ Backend và hiển thị chính xác lên giao diện  
4. Frontend không xử lý các thuật toán mapping hay logic nghiệp vụ  

---

## Objective 3: Hiển thị lịch sử thay đổi đơn vị hành chính
**Mục tiêu:**  
Cung cấp thông tin giúp người dùng hiểu rõ quá trình thay đổi địa chỉ hành chính.

**Key Results:**  
1. Hiển thị thông tin địa chỉ trước khi sáp nhập  
2. Hiển thị thông tin địa chỉ sau khi sáp nhập  
3. Hiển thị thời điểm diễn ra thay đổi  
4. Hiển thị hình thức thay đổi (đổi tên, gộp đơn vị hành chính)  

---

## Objective 4: Cải thiện trải nghiệm người dùng khi tra cứu
**Mục tiêu:**  
Nâng cao trải nghiệm sử dụng hệ thống trong quá trình tra cứu dữ liệu.

**Key Results:**  
1. Hiển thị trạng thái loading khi đang gọi API  
2. Thông báo rõ ràng khi không tìm thấy dữ liệu  
3. Hiển thị thông báo lỗi khi Backend trả về lỗi  
4. Giảm tối đa sự nhầm lẫn cho người dùng khi dữ liệu không tồn tại  

---

## Objective 5: Tổ chức Frontend theo mô hình FE – BE tách biệt
**Mục tiêu:**  
Rèn luyện kỹ năng xây dựng hệ thống theo kiến trúc Frontend – Backend phân tách rõ ràng.

**Key Results:**  
1. Frontend chỉ đảm nhiệm giao diện và hiển thị dữ liệu  
2. Không lưu trữ dữ liệu hành chính trên Frontend  
3. Không can thiệp vào logic xử lý nghiệp vụ của Backend  
4. Cấu trúc thư mục rõ ràng, dễ bảo trì và mở rộng  

### Cấu trúc thư mục Frontend (dự kiến)
src/
 ├─ pages/        # Các trang chức năng chính
 ├─ components/   # Component giao diện dùng chung
 ├─ services/     # Xử lý gọi API
 ├─ styles/       # CSS / styling
 └─ App.jsx

---

### Objective 6: Hoàn thành Frontend trong phạm vi và thời gian thực tập
**Mục tiêu:**  
Hoàn thiện Frontend phù hợp với yêu cầu học tập và thời gian thực tập.

**Key Results:**  
1. Chỉ tập trung vào chức năng tra cứu và hiển thị dữ liệu  
2. Không triển khai chức năng đăng nhập và phân quyền người dùng  
3. Không tích hợp bản đồ hoặc các chức năng GIS  
4. Giao diện ở mức cơ bản, ưu tiên tính rõ ràng và dễ sử dụng  

---

## Objective 7: Thu thập góp ý để hoàn thiện hệ thống
**Mục tiêu:**  
Đánh giá và cải thiện Frontend nhằm tăng tính thực tiễn của hệ thống.

**Key Results:**  
1. Đánh giá phạm vi Frontend có phù hợp với thời gian thực tập  
2. Đánh giá cách tổ chức chức năng và giao diện người dùng  
3. Xác định các hạn chế của Frontend trong phiên bản hiện tại  
4. Đề xuất các chức năng Frontend có thể phát triển trong tương lai  

---

## Công nghệ sử dụng
- **Framework Frontend:** React  
- **Gọi API:** Fetch / Axios  
- **Styling:** CSS / Tailwind CSS  
- **Công cụ build:** Vite  **
```bash
