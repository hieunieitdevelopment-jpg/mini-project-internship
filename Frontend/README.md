# BÁO CÁO TIẾN ĐỘ DỰ ÁN

## I. NHỮNG GÌ ĐÃ HOÀN THIỆN

### 1. Hệ thống Xác thực & Phân quyền (Auth & Authorization)

-   **Đăng ký & Đăng nhập**: Đã kết nối thành công với API thật, xử lý
    ngoại lệ và truyền đúng cấu trúc dữ liệu gồm `username`,
    `full_name`, `email`, `password`, `phone`.
-   **Xử lý Token JWT**: Đã xây dựng cơ chế giải mã JWT an toàn, chuẩn
    hóa Base64 và xử lý tốt cả dữ liệu tiếng Việt, giúp lấy chính xác
    thông tin người dùng và quyền (`role`).
-   **Protected Route**: Đã tạo `ProtectedRoute.jsx` để bảo vệ trang
    `/admin`, ngăn chặn truy cập trái phép.
-   **Header động**: Giao diện Header tự động cập nhật trạng thái đăng
    nhập, hiển thị tên người dùng và quyền Admin mà không cần reload
    trang.

### 2. Tính năng Tra cứu địa giới (Home.jsx)

-   **Tra cứu nhanh**: Gọi API gợi ý khi người dùng nhập từ khóa.
-   **Dropdown**: Tự động tải danh sách Tỉnh/Thành, Quận/Huyện,
    Xã/Phường từ API, xử lý bật/tắt linh hoạt theo chế độ tra cứu.
-   **Hiển thị kết quả**: Hiển thị thông tin địa chỉ cũ/mới và chi tiết
    Nghị quyết (số quyết định, ngày hiệu lực, loại thay đổi).

### 3. Tích hợp Bản đồ (AddressDetail.jsx)

-   Sử dụng **OpenStreetMap (Nominatim API)** để tìm tọa độ.
-   **Cơ chế fallback**: Nếu không tìm thấy cấp xã, tự động tìm cấp
    huyện hoặc tỉnh.
-   **Session Storage**: Lưu dữ liệu để không mất khi reload trang.

### 4. UI/UX & Responsive

-   Sử dụng **Tailwind CSS**, giao diện hiện đại.
-   Tương thích tốt trên mobile và desktop, có menu hamburger cho
    mobile.

------------------------------------------------------------------------

## II. NHỮNG GÌ CẦN PHÁT TRIỂN

### 1. Trang Admin (Hiện đang dùng Mock Data)

-   Cần gọi API thật để lấy danh sách người dùng.
-   Gửi token trong Header để xác thực.

### 2. Chức năng Admin chưa hoạt động

-   Các nút **Thêm, Sửa, Xóa** chưa có xử lý.
-   Cần xây dựng form/modal và gọi API `POST`, `PUT`, `DELETE`.

### 3. Xử lý Token hết hạn

-   Chưa có cơ chế xử lý lỗi `401 Unauthorized`.
-   Cần tự động logout và yêu cầu đăng nhập lại.

### 4. Trang Profile

-   Chưa có trang quản lý thông tin cá nhân.
-   Cần xây dựng chức năng cập nhật thông tin và đổi mật khẩu.

------------------------------------------------------------------------

## VẤN ĐỀ CÒN TỒN TẠI (BUG)

### 5. MapView chưa lấy đúng tọa độ

-   **Thực trạng**:\
    Chức năng hiển thị bản đồ trong `AddressDetail.jsx` đôi lúc chưa trả
    về tọa độ chính xác, đặc biệt khi địa chỉ ở cấp **Xã/Phường** hoặc
    địa chỉ có định dạng không chuẩn.

-   **Nguyên nhân**:

    -   API OpenStreetMap (Nominatim) phụ thuộc vào chuỗi địa chỉ truyền
        vào.
    -   Một số địa chỉ hành chính tại Việt Nam không được chuẩn hóa.
    -   Chuỗi query chưa tối ưu (thiếu thứ tự: xã → huyện → tỉnh → Việt
        Nam).

-   **Hướng xử lý**:

    -   Chuẩn hóa chuỗi địa chỉ (loại bỏ tiền tố như "Phường", "Xã"...).

    -   Format chuẩn:

            [Tên địa danh], [Quận/Huyện], [Tỉnh/Thành], Vietnam

    -   Cải thiện fallback:

        -   Không có cấp xã → fallback huyện
        -   Không có huyện → fallback tỉnh

    -   Thêm log debug để kiểm tra request API.

-   **Định hướng cải thiện**:

    -   Có thể dùng thêm Google Maps Geocoding API để tăng độ chính xác.
    -   Cache tọa độ để giảm số lần gọi API.

------------------------------------------------------------------------