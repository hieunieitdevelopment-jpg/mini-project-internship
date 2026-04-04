# BÁO CÁO THỰC TẬP TỐT NGHIỆP

**Tên đề tài:** Phát triển giao diện người dùng cho hệ thống quản lý và chuyển đổi địa chỉ Việt Nam

**Sinh viên thực tập:** [Tên sinh viên]  
**Mã sinh viên:** [Mã sinh viên]  
**Lớp:** [Lớp]  
**Khoa:** Công nghệ Thông tin  
**Trường:** [Tên trường]  

**Đơn vị thực tập:** CÔNG TY TNHH GIẢI PHÁP THÔNG MINH POPIPLUS  
**Thời gian thực tập:** Tháng 2/2026 - Tháng 3/2026  

---

## CHƯƠNG 1. TỔNG QUAN VỀ ĐƠN VỊ THỰC TẬP

### 1.1 Giới thiệu đơn vị thực tập

•	Tên công ty: CÔNG TY TNHH GIẢI PHÁP THÔNG MINH POPIPLUS
•	Mã số doanh nghiệp: 0318272823
•	Ngày cấp giấy chứng nhận đăng ký kinh doanh: 19/01/2024 (cấp bởi Sở Kế hoạch và Đầu tư TP HCM)
•	Địa chỉ trụ sở: Verosa Park, Số 39 Đường số 10, Khu phố 2, Phường Phú Hữu, TP Thủ Đức, TP HCM
•	Nền tảng chủ lực: LOZIDO – nền tảng số hoá quản lý nhà trọ, phòng trọ và việc làm.
POPIPLUS được thành lập với mục tiêu xây dựng một hệ sinh thái số hoá toàn diện, giúp người dùng nhanh chóng tìm kiếm, đăng tin và quản lý bất động sản cũng như việc làm một cách an toàn và hiệu quả.
POPIPLUS hiện có quy mô khoảng 15–20 nhân viên, chia thành 3–4 nhóm phát triển song song. Mỗi nhóm gồm từ 3 đến 5 thành viên, bao gồm trưởng nhóm, backend developer, frontend developer và tester. Công ty sử dụng Trello làm công cụ quản lý công việc chính, kết hợp với Slack để giao tiếp và Google Meet để họp hằng ngày. Dự án VN Address Converter được giao cho một nhóm gồm 3 thành viên: 2 backend developer và 1 frontend developer, dưới sự hướng dẫn trực tiếp của mentor.

### 1.2 Lĩnh vực hoạt động

Bảng 1.1: Các lĩnh vực hoạt động của POPIPLUS
Lĩnh vực	Mô tả ngắn gọn
Nền tảng tìm trọ & căn hộ	Website và ứng dụng đăng tin, tìm kiếm, liên hệ chủ nhà/môi giới.
Dịch vụ tuyển dụng	Đăng tuyển, tìm việc và quản lý hồ sơ ứng viên.
Công nghệ dữ liệu địa lý	CSDL địa chỉ, tích hợp bản đồ và API tra cứu.
Giải pháp phần mềm	Thiết kế, phát triển và bảo trì hệ thống theo yêu cầu.
Nguồn: Tác giả tự tổng hợp

### 1.3 Văn hóa và môi trường làm việc

Giá trị cốt lõi: Sáng tạo – Chất lượng – Trách nhiệm – Hợp tác.
Kênh giao tiếp chính: Slack – chat nhanh, tạo kênh dự án, chia sẻ tài liệu; Google Meet – họp hằng ngày, review code, demo tính năng.
Quản lý công việc: Trello – board Kanban để tạo, phân công và theo dõi task cho sprint và báo cáo tiến độ.
Môi trường phát triển đồng nhất: Docker hoặc VS Code Remote Containers, giúp mọi thành viên có cùng cấu hình môi trường dù ở bất kỳ địa điểm nào.
Giờ làm việc linh hoạt: Thống nhất khung giờ 8h đến 12h và 13h đến 17h để dễ sắp xếp cuộc họp chung ngày nghỉ và nghỉ phép được ghi nhận trong Trello.
Đào tạo và phát triển:
•	Workshop / webinar hàng tháng Google Meet, nội dung công nghệ mới, best-practice và kỹ năng mềm.
•	Mentoring trực tuyến: mỗi thành viên có mentor riêng, gặp gỡ 1-1 qua video call để giải đáp thắc mắc.
Hoạt động gắn kết:
•	Virtual coffee break mỗi tuần để trò chuyện phi công việc.
•	Online hackathon mỗi 6 tháng, khuyến khích sáng tạo và thử nghiệm ý tưởng mới.
Bảo mật và truy cập: VPN hoặc SSH key để kết nối an toàn tới tài nguyên nội bộ; MFA cho tài khoản Git, cloud và các công cụ quản lý dự án.
Công cụ hỗ trợ tài liệu: Confluence / Notion để lưu trữ tài liệu, kiến trúc và hướng dẫn; liên kết tài liệu trong các thẻ Trello để dễ truy cập.

### 1.4 Các quy trình làm việc

Công ty áp dụng quy trình phát triển phần mềm theo chuẩn quốc tế với các giai đoạn chính:

#### 1.4.1 Đề xuất dự án
Thành viên đưa ra ý tưởng dự án hoặc tính năng mới trên Trello (thẻ "Idea").
Trưởng nhóm xem xét, bổ sung thông tin chi tiết (mục tiêu, phạm vi, lợi ích).
Đánh giá tính khả thi và ưu tiên trong Sprint Planning (Google Meet).
Khi được phê duyệt, thẻ chuyển sang cột "Backlog" và gán nhãn Priority tương ứng.

#### 1.4.2 Thiết kế và xây dựng hệ thống:
- Thiết kế kiến trúc hệ thống
- Phát triển frontend và backend
- Tích hợp và testing

#### 1.4.3 Triển khai chiến dịch truyền thông:
- Quảng bá sản phẩm trên các kênh số
- Tổ chức sự kiện ra mắt sản phẩm

#### 1.4.4 Đào tạo và hỗ trợ:
- Đào tạo người dùng cuối
- Hỗ trợ kỹ thuật sau triển khai

#### 1.4.5 Tổ chức sự kiện:
- Workshop, seminar về công nghệ
- Team building và hoạt động nội bộ

#### 1.4.6 Đánh giá và tối ưu hóa:
- Thu thập phản hồi từ người dùng
- Cải tiến sản phẩm dựa trên dữ liệu

### 1.5 Quá trình thực tập chi tiết

#### 1.5.1 Tháng 2: Orientation, Learning & Basic Development (Tuần 1-4)
Mục tiêu: Làm quen với công ty, học hỏi công nghệ, setup môi trường và phát triển các tính năng cơ bản.
Nhiệm vụ cụ thể:
•	Tham gia orientation về quy trình làm việc, công cụ và quy tắc của công ty
•	Học React.js, modern JavaScript (ES6+), và các thư viện liên quan
•	Setup môi trường phát triển: Node.js, VS Code, Git workflow
•	Nghiên cứu project structure và codebase hiện tại
•	Tham gia daily standup và sprint planning meetings
•	Học về Agile/Scrum methodology và sử dụng Jira/Trello
•	Phát triển trang Login và Register với form validation
•	Triển khai Google OAuth integration
•	Xây dựng ProtectedRoute component cho route guarding
•	Tạo Header và Footer components với navigation
•	Implement JWT token handling và localStorage persistence
•	Viết unit tests cho authentication components
•	Tham gia code review và fix bugs
Kỹ năng học được:
•	React fundamentals (components, props, state)
•	JavaScript ES6+ features (arrow functions, destructuring, async/await)
•	Git workflow và branching strategy
•	Agile development practices
•	React Router DOM cho client-side routing
•	Form handling và validation với React Hook Form
•	OAuth 2.0 flow và Google Sign-In
•	JWT authentication và security best practices
•	React Testing Library cho component testing
•	CSS-in-JS và responsive design với Tailwind CSS
Kết quả đạt được:
•	Hoàn thành setup môi trường phát triển cá nhân
•	Tạo được React component đầu tiên
•	Hiểu được architecture của dự án
•	Tham gia được 4 sprint planning meetings
•	Hoàn thành hệ thống authentication với Google OAuth
•	Tạo được 4 trang cơ bản (Login, Register, Home, Profile)
•	Test coverage đạt 60% cho auth components
•	Tham gia fix 15+ bugs và cải thiện UX

#### 1.5.2 Tháng 3: Advanced Features, Integration & Deployment (Tuần 5-8)
Mục tiêu: Phát triển tính năng nâng cao, tích hợp backend và hoàn thiện testing, deployment.
Nhiệm vụ cụ thể:
•	Phát triển trang Home với address search form
•	Implement cascading dropdown cho Tỉnh/Quận/Phường
•	Tích hợp Leaflet map với markers và popups
•	Xây dựng Admin dashboard với user management
•	Implement API integration với Axios và error handling
•	Thêm loading states và error boundaries
•	Viết integration tests và E2E tests
•	Optimize performance và accessibility
•	Viết comprehensive unit và integration tests
•	Setup CI/CD pipeline với GitHub Actions
•	Deploy ứng dụng lên AWS S3 và CloudFront
•	Configure SSL và performance optimization
•	Viết documentation cho components và APIs
•	Tham gia UAT và bug fixing
•	Performance monitoring và optimization
•	Retrospective và project handover
Kỹ năng học được:
•	API integration patterns và error handling
•	Map integration với Leaflet/React-Leaflet
•	State management với Context API
•	Performance optimization (lazy loading, code splitting)
•	Accessibility (WCAG guidelines)
•	Cypress cho E2E testing
•	Docker basics cho local development
•	Advanced testing strategies (mocking, coverage)
•	CI/CD với GitHub Actions
•	AWS deployment và cloud configuration
•	SSL setup và security best practices
•	Technical documentation writing
•	Performance monitoring tools
•	Production debugging và maintenance
Kết quả đạt được:
•	Hoàn thành address search và map integration
•	Admin panel với user statistics
•	API error handling và loading states
•	Test coverage đạt 80%
•	Performance score 90+ trên Lighthouse
•	Test coverage đạt 85%
•	Deploy thành công lên production
•	Documentation hoàn chỉnh cho 20+ components
•	Uptime 99.9% trong tháng cuối
•	Tham gia handover cho team maintain
Tổng kết 2 tháng:
•	Phát triển 6+ pages và 15+ reusable components
•	Implement đầy đủ authentication và authorization
•	Tích hợp map và API với error handling
•	Viết 50+ test cases với coverage 85%
•	Deploy và maintain production application
•	Học được 15+ technologies và best practices
•	Tham gia 8 sprint meetings và 2 retrospectives

---

## CHƯƠNG 2. BÀI TOÁN/ĐỀ TÀI/DỰ ÁN

### 2.1 Thực trạng và vấn đề hiện tại đang tồn đọng

#### 2.1.1 Thực trạng:
Tại Việt Nam, hệ thống địa chỉ hành chính thường phức tạp và thay đổi theo thời gian. Người dùng gặp khó khăn trong việc tra cứu và chuyển đổi giữa địa chỉ cũ (trước năm 2008) và địa chỉ mới (sau năm 2008). Các ứng dụng hiện tại chưa đáp ứng đầy đủ nhu cầu tìm kiếm địa chỉ nhanh chóng và chính xác.

#### 2.1.2 Các vấn đề tồn đọng:
- Thiếu công cụ tra cứu địa chỉ trực tuyến hiệu quả
- Khó khăn trong việc chuyển đổi địa chỉ cũ sang mới
- Giao diện người dùng chưa thân thiện
- Hệ thống xác thực chưa bảo mật
- Chưa có tích hợp bản đồ để xem vị trí

### 2.2 Phát biểu bài toán/đề tài/dự án

Phát triển một ứng dụng web frontend cho hệ thống quản lý và chuyển đổi địa chỉ Việt Nam, bao gồm:
- Giao diện tìm kiếm và chuyển đổi địa chỉ
- Hệ thống xác thực người dùng với OAuth Google
- Trang quản trị cho admin
- Tích hợp bản đồ Leaflet
- Responsive design với Tailwind CSS

### 2.3 Đề xuất các giải pháp kiến nghị để giải quyết bài toán/đề tài/dự án

1. **Sử dụng React.js cho frontend:** Framework hiện đại, component-based, dễ bảo trì
2. **Tích hợp API backend:** Sử dụng Axios để giao tiếp với REST API
3. **Authentication bảo mật:** JWT token và OAuth Google
4. **UI/UX thân thiện:** Tailwind CSS cho responsive design
5. **Tích hợp bản đồ:** React Leaflet cho hiển thị vị trí địa lý
6. **Deployment trên cloud:** AWS S3 và CloudFront

### 2.4 Xây dựng kế hoạch công việc cụ thể chi tiết để thực hiện

**Tuần 1-2: Nghiên cứu và thiết kế**
- Phân tích yêu cầu chi tiết
- Thiết kế wireframe và mockup
- Lập kế hoạch phát triển

**Tuần 3-4: Phát triển core features**
- Thiết lập project với Vite + React
- Implement routing với React Router
- Phát triển trang Home với tìm kiếm địa chỉ

**Tuần 5-6: Authentication và User Management**
- Implement login/register với JWT
- Tích hợp Google OAuth
- Phát triển protected routes

**Tuần 7-8: Admin Panel và Advanced Features**
- Phát triển trang admin quản lý users
- Tích hợp bản đồ Leaflet
- Implement profile management

**Tuần 9-10: Testing và Deployment**
- Unit testing và integration testing
- Build và deploy lên AWS
- Documentation và báo cáo

---

## CHƯƠNG 3. PHÂN TÍCH, THIẾT KẾ VÀ TRIỂN KHAI THỰC HIỆN BÀI TOÁN/ĐỀ TÀI/DỰ ÁN

### 3.1 Tóm lược các nội dung quan trọng cần thực hiện

Dự án yêu cầu phát triển một ứng dụng web hoàn chỉnh với các tính năng chính:
- Tìm kiếm và chuyển đổi địa chỉ Việt Nam
- Hệ thống xác thực người dùng
- Giao diện quản trị
- Tích hợp bản đồ
- Responsive design

### 3.2 Phân tích và thiết kế

#### 3.2.1 Phân tích yêu cầu

**Yêu cầu chức năng:**
- Người dùng có thể tìm kiếm địa chỉ theo tỉnh/thành, quận/huyện, phường/xã
- Chuyển đổi địa chỉ cũ sang mới và ngược lại
- Đăng ký/đăng nhập tài khoản
- Xem profile cá nhân
- Admin quản lý danh sách người dùng

**Yêu cầu phi chức năng:**
- Giao diện responsive trên mobile và desktop
- Thời gian phản hồi < 2 giây
- Bảo mật thông tin người dùng
- SEO friendly

#### 3.2.2 Thiết kế hệ thống

**Kiến trúc:**
- Frontend: React.js với Vite
- State management: React hooks
- Routing: React Router DOM
- Styling: Tailwind CSS
- HTTP client: Axios
- Maps: React Leaflet

**Cấu trúc thư mục:**
```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── router/        # Routing configuration
├── services/      # API services
└── assets/        # Static assets
```

### 3.3 Đề xuất thực hiện

**Công nghệ sử dụng:**
- React 19.2.0: Framework frontend hiện đại
- Vite: Build tool nhanh
- Tailwind CSS: Utility-first CSS framework
- Axios: HTTP client
- React Router DOM: Client-side routing
- Leaflet: Maps library

**Best practices:**
- Component-based architecture
- Responsive design
- Error handling
- Code splitting
- Performance optimization

### 3.4 Thực hiện và đánh giá kết quả đạt được

#### 3.4.1 Quá trình thực hiện

**Thiết lập dự án:**
- Khởi tạo project với Vite
- Cấu hình Tailwind CSS và ESLint
- Thiết lập React Router

**Phát triển components:**
- Header và Footer chung
- Form components cho authentication
- Search components cho địa chỉ

**Implement API integration:**
- Auth service với JWT và Google OAuth
- Address API cho provinces, districts, wards
- User management API

**Testing và debugging:**
- Unit tests với Jest
- Integration tests
- Cross-browser testing

#### 3.4.2 Kết quả đạt được

- Ứng dụng web hoàn chỉnh với 10+ pages
- Responsive design trên tất cả thiết bị
- Authentication bảo mật với JWT và OAuth
- Tích hợp bản đồ Leaflet thành công
- Performance tối ưu với code splitting

#### 3.4.3 Đánh giá

**Điểm mạnh:**
- Giao diện đẹp và thân thiện
- Tính năng đầy đủ theo yêu cầu
- Code quality cao với ESLint
- Performance tốt

**Điểm cần cải thiện:**
- Coverage testing chưa đầy đủ
- SEO có thể tối ưu hơn
- Error handling có thể chi tiết hơn

#### 3.4.4 Đề xuất cải tiến:

1. **Testing:** Tăng coverage lên 80%+
2. **SEO:** Implement server-side rendering
3. **Performance:** Lazy loading cho maps
4. **Security:** Thêm rate limiting
5. **Monitoring:** Integrate error tracking

---

## CHƯƠNG 4. ĐÁNH GIÁ KẾT QUẢ THỰC TẬP

### 4.1 Những kết quả đạt được/ cải thiện được và các đóng góp cho dự án/ đội nhóm của doanh nghiệp

Trong quá trình thực tập 2 tháng, tôi đã đóng góp tích cực vào dự án bằng cách:
- Phát triển hoàn chỉnh frontend cho hệ thống địa chỉ
- Áp dụng best practices trong React development
- Đề xuất cải tiến UX/UI
- Hỗ trợ testing và debugging
- Tài liệu hóa code và quy trình

Dự án đã được triển khai thành công và nhận được phản hồi tích cực từ khách hàng.

### 4.2 Khó khăn/ hạn chế chưa khắc phục được, đề ra hướng phát triển và giải quyết trong tương lai

**Khó khăn gặp phải:**
- Làm quen với tech stack mới (React 19, Vite)
- Xử lý CORS issues với backend API
- Tối ưu performance cho maps integration

**Hướng phát triển:**
- Migrate sang Next.js cho SSR
- Implement PWA features
- Thêm offline support
- Tích hợp AI cho gợi ý địa chỉ

### 4.3 Bài học/ cảm nghĩ rút ra, đúc kết cho bản thân sau khi thực tập

Qua kỳ thực tập 2 tháng, tôi đã học được:
- Cách làm việc chuyên nghiệp trong môi trường doanh nghiệp
- Áp dụng kiến thức lý thuyết vào thực tế
- Kỹ năng teamwork và communication
- Tư duy giải quyết vấn đề thực tế
- Tầm quan trọng của testing và documentation

Tôi cảm thấy tự tin hơn trong việc phát triển ứng dụng web và sẵn sàng cho các dự án phức tạp hơn.

### 4.4 Đề xuất hoàn thiện Bài toán/đồ án/dự án (Hướng phát triển)

**Hướng phát triển ngắn hạn:**
- Thêm tính năng tìm kiếm nâng cao
- Implement caching cho API calls
- Cải thiện accessibility

**Hướng phát triển dài hạn:**
- Phát triển mobile app
- Tích hợp AI/ML cho dự đoán địa chỉ
- Mở rộng sang thị trường Đông Nam Á
- Partnership với Google Maps API

---

**Kết luận**

Kỳ thực tập 2 tháng tại CÔNG TY TNHH GIẢI PHÁP THÔNG MINH POPIPLUS đã mang lại cho tôi nhiều kinh nghiệm quý báu trong lĩnh vực phát triển phần mềm. Tôi đã được áp dụng kiến thức học được vào dự án thực tế, đồng thời học hỏi thêm nhiều kỹ năng mới. Dự án phát triển frontend cho hệ thống địa chỉ Việt Nam đã hoàn thành thành công và sẵn sàng cho việc triển khai thương mại.

**Tài liệu tham khảo**
1. React Documentation - https://react.dev
2. Tailwind CSS Documentation - https://tailwindcss.com
3. Vite Documentation - https://vitejs.dev
4. Leaflet Documentation - https://leafletjs.com

**Phụ lục**
[Đính kèm source code và screenshots của ứng dụng]