# Sprint Review (Backend)
## Mục tiêu Sprint 
- Xây dựng REST API backend hoàn chỉnh phục vụ tra cứu, tìm kiếm, và chuyển đổi đơn vị hành chính cũ ↔ mới, sử dụng Node.js + Express + PostgreSQL. Bao gồm từ thiết kế database, viết API, validation, error handling
### Các tính năng đã hoàn thành trong sprint 
- Database Design & Setup
    - Design 3 bảng gồm: 
        - administrative_units: Chứa cả 3 cấp tỉnh/huyện/xã
        - administrative_changes: Thông tin nghị quyết thay đổi
        - administrative_change_mappings: Mapping cũ ↔ mới

- Server Setup & Configuration
    - Express app với CORS (cho phép frontend khác domain gọi API)
    - express.json() parse request body
    - Swagger UI tại /api-docs
    - API routes tại /api/v1/...
    - Centralized error handler đặt cuối middleware chain
    - Kết nối DB 

### API đã hoàn thành 

- Dropdown API - Lấy danh sách địa danh
    - GET /api/v1/provinces ( Lấy tất cả tỉnh/thành phố đang hoạt động )
    - GET /api/v1/provinces/:provinceId/districts ( Lấy huyện theo tỉnh )
    - GET /api/v1/districts/:districtId/wards   ( Lấy xã theo huyện )
    - GET /api/v1/provinces/:provinceId/wards?active=true|false  (Lấy xã theo tỉnh (bỏ qua huyện))
    - URL theo chuẩn RESTful
    - Query param ?active=false để lấy xã cũ đã giải thể.

- Suggest API - Gợi ý autocomplete
    - GET /api/v1/units/suggest?q=... Gợi ý đơn vị khi user đang gõ
        - ILIKE + unaccent() — tìm không dấu, không phân biệt hoa/thường.
        - Optional filter: level, direction.
        - Giới hạn 10 kết quả.

- Fuzzy Search API — Tìm kiếm gần đúng
    - GET /api/v1/units/search?q=...    (Tìm kiếm gần đúng (cho phép sai chính tả))
        - similarity() (pg_trgm) + unaccent() + ILIKE.
        - Trả kèm score (điểm tương đồng) và mapping info nếu có.
        - Query phức tạp nhất: 8 JOIN, CASE WHEN.

- Mapping API — Tra cứu chuyển đổi cũ <--> mới
    - GET /api/v1/mappings?direction=old-to-new    ( Đơn vị cũ → xem mới tương ứng )
    - GET /api/v1/mappings?direction=new-to-old    ( Đơn vị mới → xem cũ tương ứng )
        - Filter theo province, district, ward (ít nhất 1).
        - Trả kèm thông tin nghị quyết (change_type, resolution_number, effective_date).
        - Smart search với ILIKE + unaccent.

- Validation & Error Handling
    - validateProvinceId    ( Dropdown huyện, xã theo tỉnh )
    - validateDistrictId    ( Dropdown xã theo huyện )
    - validateActiveQuery   ( Filter active/inactive )
    - validateSuggest       ( Suggest API (q, level, direction) )
    - validateFuzzySearch   ( Fuzzy search API )
    - validateMapping       ( Mapping API )

- Error Handling:
    - custom error có status code + isOperational flag.
    - centralized, phân biệt lỗi operational (trả message cụ thể) vs programming (trả "Lỗi server").

- API Documentation (Swagger)
    - Config Swagger/OpenAPI 3.0
    - JSDoc annotations trên mỗi route — mô tả parameters, request body, responses.

---

## What went well
- Kiến trúc 3 tầng rõ ràng — Route -> Controller -> Service -> Model
- Dynamic WHERE pattern — conditions[] + params[] linh hoạt cho optional filters, tái sử dụng cho suggest/fuzzy/mapping.
- PostgreSQL extensions — pg_trgm + unaccent giải quyết tốt bài toán tìm kiếm tiếng Việt không dấu + gần đúng, không cần thư viện ngoài.
- Centralized error handling — 1 chỗ duy nhất xử lý mọi lỗi, response lỗi nhất quán { success: false, message }.
- Database indexes — GIN index cho trigram, composite index cho level+active, index cho parent_id → query nhanh.
- Swagger documentation — Mọi endpoint đều có docs, dễ test và handoff cho frontend.
- RESTful API design — URL chuẩn, query params cho filter, HTTP status đúng ngữ nghĩa (200, 201, 400, 401, 500).
- Dev tools — nodemon auto-restart, prettier format code


## What didn't go well
- Dùng pg.Client thay vì pg.Pool - 1 connection duy nhất, bottleneck khi nhiều request đồng thời.
- Không có pagination - API trả tất cả kết quả. Data lớn → response nặng, chậm.
- Logging bằng console.log - Không có log levels, không file output, không timestamp chuẩn.
- Chưa có unit test - Không test nào cho service/model. Refactor có thể break mà không biết.
- Code lặp - validateSuggest ≈ validateFuzzySearch (100% giống). oldToNew.service ≈ newToOld.service.
- Fuzzy search query quá phức tạp - 8 JOIN trong 1 query, khó debug. Có thể tách view/stored procedure.
- Không có rate limiting - API public không giới hạn request → dễ bị abuse/DDoS.
- Schema không có migration tool - Dùng file .sql thủ công. Khi đổi schema phải chạy tay.

---

# Sprint Review (Fronend)
## Mục tiêu Sprint(Frontend)


### 1. Tính năng Tra cứu địa giới (Home.jsx)

-   Tra cứu nhanh: Gọi API gợi ý khi người dùng nhập từ khóa.
-   Dropdown: Tự động tải danh sách Tỉnh/Thành, Quận/Huyện,
    Xã/Phường từ API, xử lý bật/tắt linh hoạt theo chế độ tra cứu.
-   Hiển thị kết quả**: Hiển thị thông tin địa chỉ cũ/mới và chi tiết
    Nghị quyết (số quyết định, ngày hiệu lực, loại thay đổi).

### 2. Tích hợp Bản đồ (AddressDetail.jsx)

-   Sử dụng OpenStreetMap (Nominatim API) để tìm tọa độ.
-   Cơ chế fallback**: Nếu không tìm thấy cấp xã, tự động tìm cấp
    huyện hoặc tỉnh.
-   Session Storage**: Lưu dữ liệu để không mất khi reload trang.

### 3. UI/UX & Responsive

-   Sử dụng Tailwind CSS, giao diện hiện đại.
-   Tương thích tốt trên mobile và desktop, có menu hamburger cho
    mobile.

## What went well

### 1. Trang Admin (Hiện đang dùng Mock Data)

-   Cần gọi API thật để lấy danh sách người dùng.
-   Gửi token trong Header để xác thực.

### 2. Chức năng Admin chưa hoạt động

-   Các nút Thêm, Sửa, Xóa chưa có xử lý.
-   Cần xây dựng form/modal và gọi API `POST`, `PUT`, `DELETE`.

### 3. Xử lý Token hết hạn

-   Chưa có cơ chế xử lý lỗi `401 Unauthorized`.
-   Cần tự động logout và yêu cầu đăng nhập lại.

### 4. Trang Profile

-   Chưa có trang quản lý thông tin cá nhân.
-   Cần xây dựng chức năng cập nhật thông tin và đổi mật khẩu.

## VẤN ĐỀ CÒN TỒN TẠI (BUG)

### 5. MapView chưa lấy đúng tọa độ

-   Thực trạng:
    Chức năng hiển thị bản đồ trong `AddressDetail.jsx` đôi lúc chưa trả
    về tọa độ chính xác, đặc biệt khi địa chỉ ở cấp Xã/Phường hoặc
    địa chỉ có định dạng không chuẩn.

-   Nguyên nhân:

    -   API OpenStreetMap (Nominatim) phụ thuộc vào chuỗi địa chỉ truyền
        vào.
    -   Một số địa chỉ hành chính tại Việt Nam không được chuẩn hóa.
    -   Chuỗi query chưa tối ưu (thiếu thứ tự: xã → huyện → tỉnh → Việt
        Nam).

-   Hướng xử lý:

    -   Chuẩn hóa chuỗi địa chỉ (loại bỏ tiền tố như "Phường", "Xã"...).

    -   Format chuẩn:

            [Tên địa danh], [Quận/Huyện], [Tỉnh/Thành], Vietnam

    -   Cải thiện fallback:

        -   Không có cấp xã → fallback huyện
        -   Không có huyện → fallback tỉnh

    -   Thêm log debug để kiểm tra request API.

-   Định hướng cải thiện:

    -   Có thể dùng thêm Google Maps Geocoding API để tăng độ chính xác.
    -   Cache tọa độ để giảm số lần gọi API.
