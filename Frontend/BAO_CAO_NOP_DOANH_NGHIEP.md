# BAO CAO TONG KET DU AN FRONTEND
## Du an: He thong Tra cuu thay doi dia gioi hanh chinh
## Don vi thuc hien: Thuc tap sinh Frontend
## Ngay bao cao: 04/04/2026

---

## Muc luc

1. Tong quan du an
2. Cong nghe va kien truc
3. Cac tinh nang da hoan thanh
4. Ket qua dat duoc
5. Han che va ton tai hien tai
6. Danh gia chat luong va muc do san sang
7. Ke hoach de xuat giai doan tiep theo
8. Nhu cau ho tro tu doanh nghiep
9. Ket luan
10. Phu luc endpoint dang su dung
11. Quy trinh demo he thong
12. Khung chen hinh anh minh chung
13. Ke hoach cong viec theo tuan (de xuat)
14. Danh gia ca nhan thuc tap sinh

---

## 1. Tong quan du an

### 1.1. Bai toan nghiep vu
Doanh nghiep can mot he thong cho phep:
- Tra cuu su thay doi dia gioi hanh chinh theo huong Cu -> Moi va Moi -> Cu.
- Hien thi thong tin doi chieu dia chi, thong tin nghi quyet va ban do vi tri.
- Ho tro xac thuc nguoi dung, phan quyen admin va san sang cho mo rong API.

### 1.2. Muc tieu thuc hien
- Xay dung giao dien web phan hoi nhanh, de su dung tren desktop/mobile.
- Ket noi du lieu that tu backend de phuc vu tra cuu dia gioi.
- Hoan thien bo tinh nang auth co ban (dang nhap, dang ky, Google, quen mat khau, dat lai mat khau, doi mat khau).
- Bao ve trang quan tri theo quyen admin.

### 1.3. Pham vi bao cao
Bao cao nay tap trung vao phan Frontend (React + Vite), bao gom kien truc, tinh nang da trien khai, ket qua dat duoc, ton tai hien tai va de xuat giai doan tiep theo.

### 1.4. Doi tuong su dung
- Nguoi dan/nguoi dung cuoi can tra cuu thay doi dia gioi.
- Nhan su ho tro nghiep vu can xac minh thong tin dia chi cu - moi.
- Quan tri vien can theo doi nguoi dung va van hanh he thong.

### 1.5. Gia tri mang lai cho doanh nghiep
- Giam thoi gian tra cuu thu cong va sai sot nghiep vu.
- Chuan hoa thong tin tra cuu dua tren du lieu nghi quyet.
- Tao nen tang tich hop API cho cac he thong noi bo/doi tac.
- Ho tro truyen thong so hoa va chuyen doi so quy trinh hanh chinh.

---

## 2. Cong nghe va kien truc

### 2.1. Cong nghe su dung
- React 19, React Router DOM 7
- Vite 7
- Tailwind CSS 4
- Axios 1
- Leaflet + React Leaflet (hien thi ban do)
- ESLint 9 (kiem tra chat luong code)

### 2.2. Cau truc frontend
- `src/components`: Header, Footer, ProtectedRoute
- `src/pages`: Home, AddressDetail, Login, Register, Profile, Admin, ForgotPassword, ResetPassword, Support, Api
- `src/router`: AppRouter
- `src/services`: authService (goi API auth)

### 2.3. Kien truc luong du lieu
- Routing 1 cap thong qua React Router.
- Trang Home goi API mappings/units/provinces/districts/wards de tra cuu.
- Ket qua mapping duoc chuyen qua route state sang trang chi tiet.
- Trang AddressDetail ket hop du lieu backend + geocoding OpenStreetMap de hien thi ban do.
- Xac thuc luu JWT va thong tin user trong localStorage.
- Header lang nghe su kien `authChange` de dong bo trang thai dang nhap tren toan app.

### 2.4. So do module frontend (mo ta)
- Layer giao dien: cac page trong `src/pages`.
- Layer dieu huong: `src/router/AppRouter.jsx`.
- Layer thanh phan dung chung: `src/components`.
- Layer giao tiep backend: `src/services/authService.js`.

### 2.5. Cac script van hanh
- `npm run dev`: chay moi truong phat trien.
- `npm run build`: build ban phat hanh.
- `npm run preview`: chay thu ban build.
- `npm run lint`: kiem tra quy tac ma nguon.

---

## 3. Cac tinh nang da hoan thanh

### 3.1. Tra cuu dia gioi hanh chinh
- Ho tro 2 che do:
  - Tra cuu nhanh theo ten Xa/Phuong (co goi y suggest).
  - Tra cuu theo bo loc dropdown Tinh -> Huyen -> Xa.
- Ho tro 2 huong chuyen doi:
  - Cu -> Moi
  - Moi -> Cu
- Hien thi ket qua doi chieu:
  - Don vi cu, don vi moi
  - Loai thay doi
  - So nghi quyet, ngay hieu luc, mo ta thay doi

### 3.2. Xuat du lieu ket qua
- Xuat CSV co BOM de hien thi tieng Viet dung tren Excel.
- Xuat JSON phuc vu tich hop he thong noi bo hoac doi tac.

### 3.3. Trang chi tiet dia chi + ban do
- Hien thi thong tin hanh chinh chi tiet theo ID don vi.
- Tich hop OpenStreetMap (Nominatim) de lay toa do va ve vung geojson.
- Co co che fallback geocoding nhieu cap:
  1) Ten + Huyen + Tinh
  2) Ten + Tinh
  3) Huyen + Tinh
  4) Tinh
- Luu mapping vao sessionStorage de tranh mat du lieu khi reload.

### 3.4. He thong xac thuc va tai khoan
- Dang nhap email/password.
- Dang ky tai khoan.
- Dang nhap/Dang ky voi Google (Google Identity Services).
- Quen mat khau: gui yeu cau reset qua email.
- Dat lai mat khau qua token.
- Trang Profile: doi mat khau khi da dang nhap.

### 3.5. Phan quyen va bao ve truy cap
- `ProtectedRoute` khoa trang `/admin` cho nguoi khong phai admin.
- Header hien/khong hien menu Admin theo role.
- Trang Admin da ket noi API lay danh sach user co Bearer token.
- Co xu ly 401 tai trang Admin/Profile: xoa session local va dieu huong ve Login.

### 3.6. UI/UX va Responsive
- Giao dien responsive tren desktop/mobile.
- Header sticky, mobile menu, bo cuc ro rang theo tung chuc nang.
- Cac trang auth co thong bao trang thai va loading state.

### 3.7. Tai lieu giao dien API tren frontend
- Da co trang API docs noi bo tai page `Api`.
- Mota endpoint theo nhom: Auth, Mappings, Units.
- Co vi du request/response de de doi chieu khi test.

---

## 4. Ket qua dat duoc

### 4.1. Ket qua chuc nang
- Da hinh thanh duoc mot frontend kha day du theo luong nghiep vu cot loi.
- Nguoi dung co the tu tra cuu va doi chieu dia chi hanh chinh nhanh.
- Da ket noi duoc API that cho phan tra cuu va auth.
- Da tao nen tang cho dashboard quan tri user.

### 4.2. Ket qua ky thuat
- Tach module theo pages/components/services ro rang.
- Co tinh san sang mo rong (them API, them role, them dashboard).
- Co lint config va script build/dev chuan cho ban giao.

### 4.3. Ket qua nghiep vu
- Tra cuu dia chi theo ten Xa/Phuong nhanh, phu hop thao tac thuc te.
- Hien thi thong tin doi chieu cu-theo-moi ro rang, de tra cuu va doi soat.
- Ho tro xuat file CSV/JSON de phuc vu bao cao noi bo.

### 4.4. Danh gia hieu nang cam nhan
- Tai giao dien nhanh trong dieu kien mang on dinh.
- Cac thao tac chinh (tra cuu, mo chi tiet, chuyen trang) dap ung su dung thuc te.
- Chua co benchmark chinh thuc (Lighthouse/monitoring), can bo sung o giai doan sau.

---

## 5. Han che va ton tai hien tai

### 5.1. Han che chuc nang
- Chuc nang them/sua/xoa user tren trang Admin chua duoc implement (UI da co nut, chua co xu ly API).
- Chua co co che refresh token tu dong cho toan he thong.
- Chua co man hinh 404 va xu ly loi tong quan theo chuan enterprise.

### 5.2. Han che ky thuat
- Base URL API dang hard-code o mot so page; chua dong nhat hoan toan qua bien moi truong.
- Chua co lop request wrapper chung de xu ly 401/global error tap trung.
- File `Navbar.jsx` dang rong (co the du thua hoac chua su dung).
- Mot so noi dung UI (vi du title/fav icon) chua duoc branding doanh nghiep.

### 5.3. Rui ro van hanh
- Geocoding OpenStreetMap co the sai lech khi du lieu ten hanh chinh khong dong nhat.
- Goi API truc tiep tu client can quan ly CORS, timeout va rate limit chat che hon.

### 5.4. Van de can theo doi trong qua trinh demo
- Google OAuth can dung domain/https hop le, neu dung IP co the bi chan origin.
- Du lieu mapping phu thuoc backend, can co bo test case on dinh truoc buoi demo.
- Can kiem tra san token va quyen admin truoc khi demo trang quan tri.

---

## 6. Danh gia chat luong va muc do san sang

### 6.1. Muc do hoan thien hien tai (uoc luong)
- Frontend core tra cuu + auth: ~80-85%
- Frontend cho van hanh doanh nghiep (co monitoring, test, hardening): ~60-65%

### 6.2. Muc do san sang trien khai
- Co the demo/noi bo ngay voi cac luong chinh.
- De san sang production day du, can bo sung 1 sprint hoan thien hardening va admin CRUD.

### 6.3. Danh gia bao mat can ban (frontend)
- Da co phan quyen route admin theo role.
- Da xu ly dang xuat khi gap 401 o mot so page.
- Chua co interceptor toan cuc va refresh token.
- Chua co chinh sach luu token an toan hon (vi du ket hop httpOnly cookie phia backend).

---

## 7. Ke hoach de xuat giai doan tiep theo

### 7.1. Uu tien cao (P1)
- Hoan thien CRUD user tren trang Admin (them/sua/xoa, validate form, confirm action).
- Chuan hoa API base URL bang `.env` cho tat ca trang.
- Tao axios/fetch client dung chung de xu ly token va 401 tap trung.
- Bo sung route 404 va trang loi than thien.

### 7.2. Uu tien trung binh (P2)
- Bo sung bo loc nang cao va phan trang ket qua tra cuu.
- Cai thien do chinh xac map (cache toa do, fallback provider khi can).
- Chuan hoa noi dung API docs va lien ket den swagger/openapi neu co.

### 7.3. Uu tien nang cao (P3)
- Bo sung test (unit test cho logic xu ly, integration test cho luong auth/tra cuu).
- Theo doi hieu nang frontend va loi runtime (Sentry/LogRocket tuong duong).
- Toi uu bao mat client (CSP, secure headers theo ha tang trien khai).

### 7.4. De xuat nguon luc va thoi gian
- Sprint 1 (1-2 tuan): Hoan thien Admin CRUD + interceptor xu ly 401.
- Sprint 2 (1 tuan): Chuan hoa env, 404/error page, bo sung test case nghiep vu.
- Sprint 3 (1 tuan): Hardening production + monitoring + nghiem thu doanh nghiep.

---

## 8. Nhu cau ho tro tu doanh nghiep

De day nhanh tien do va dat chuan production, de xuat doanh nghiep ho tro:
- Xac nhan hop dong API chinh thuc (response schema, ma loi, quy tac auth).
- Cung cap domain/HTTPS chinh thuc cho Google OAuth origin.
- Cung cap bo test data nghiep vu day du cho cac tinh huong sat nhap/tach/doi ten.
- Chot tieu chuan UI branding (logo, ten san pham, favicon, guideline mau sac).

---

## 9. Ket luan

Frontend cua he thong Tra cuu thay doi dia gioi hanh chinh da dat duoc nen tang tot cho van hanh nghiep vu:
- Co day du luong tra cuu cot loi va doi chieu dia chi.
- Co xac thuc tai khoan, Google login, profile va phan quyen admin.
- Co hinh anh san pham ro rang, co the demo va tiep tuc nang cap thanh ban production.

Trong giai doan tiep theo, viec uu tien hoan thien CRUD admin, chuan hoa tang giao tiep API va bo sung hardening/test se giup san pham dat muc san sang trien khai doanh nghiep.

---

## 10. Phu luc tom tat endpoint dang su dung tu frontend

### Auth
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/google/callback`
- POST `/api/v1/auth/request-password-reset`
- POST `/api/v1/auth/reset-password`
- POST `/api/v1/auth/change-password`
- GET `/api/v1/auth/users` (admin)

### Tra cuu dia gioi
- GET `/api/v1/provinces`
- GET `/api/v1/provinces/{id}/districts`
- GET `/api/v1/provinces/{id}/wards?active=true`
- GET `/api/v1/districts/{id}/wards?active=false`
- GET `/api/v1/mappings?direction=...&province=...&district=...&ward=...`
- GET `/api/v1/units/suggest?q=...&level=ward`
- GET `/api/v1/units/{id}`

---

## 11. Quy trinh demo he thong (de trinh bay voi doanh nghiep)

### 11.1. Muc tieu demo
- Chung minh frontend da dap ung luong nghiep vu tra cuu cu -> moi, moi -> cu.
- Chung minh he thong auth va phan quyen admin da hoat dong.
- Chung minh kha nang xem chi tiet ban do va xuat bao cao.

### 11.2. Chuan bi truoc demo
- Kiem tra backend API dang hoat dong va du lieu mau da nap.
- Kiem tra bien moi truong frontend (`VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_GOOGLE_AUTH_CALLBACK_URL`).
- Tao san 2 tai khoan:
  - Tai khoan User thuong.
  - Tai khoan Admin.
- Kiem tra internet on dinh (do co phan ban do OpenStreetMap/Google).

### 11.3. Kich ban demo de xuat (10-15 phut)
1. Gioi thieu trang chu va bai toan nghiep vu.
2. Demo tra cuu nhanh theo ten Xa/Phuong.
3. Demo tra cuu theo dropdown (Tinh -> Huyen -> Xa).
4. Demo chuyen doi huong Cu -> Moi va Moi -> Cu.
5. Mo trang chi tiet dia chi, hien thi thong tin nghi quyet va ban do.
6. Export ket qua CSV va JSON.
7. Demo dang ky/dang nhap (hoac Google login neu moi truong san sang).
8. Demo trang Profile va doi mat khau.
9. Demo phan quyen: user thuong khong vao duoc Admin, admin vao duoc.
10. Demo trang Admin (xem danh sach user).

### 11.4. Cac tinh huong hoi dap thuong gap khi demo
- Neu khach hang hoi do chinh xac map:
  - Tra loi: da co fallback nhieu cap va se nang cap cache/geocoding provider o phase tiep theo.
- Neu khach hang hoi bao mat token:
  - Tra loi: hien tai dung localStorage cho giai doan MVP; giai doan production se ket hop co che bao mat nang cao hon.
- Neu khach hang hoi mo rong API:
  - Tra loi: frontend da tach service, san sang mo rong endpoint va cau hinh env.

---

## 12. Khung chen hinh anh minh chung (ban copy screenshot vao day)

Huong dan:
- Tao thu muc anh de quan ly de dang, vi du: `Frontend/demo-images/`.
- Dat ten anh theo dung thu tu ben duoi.
- Sau khi chup man hinh, thay duong dan markdown bang ten file that.

### 12.1. Anh tong quan giao dien
![Hinh 01 - Trang chu](demo-images/01-trang-chu.png)
Chu thich: Giao dien trang chu va khu vuc tim kiem.

![Hinh 02 - Header Footer responsive](demo-images/02-header-footer-responsive.png)
Chu thich: Header/Footer tren desktop va mobile.

### 12.2. Anh demo tra cuu
![Hinh 03 - Tra cuu nhanh](demo-images/03-tra-cuu-nhanh.png)
Chu thich: Tim theo ten Xa/Phuong co goi y.

![Hinh 04 - Tra cuu dropdown](demo-images/04-tra-cuu-dropdown.png)
Chu thich: Tim theo bo loc Tinh/Huyen/Xa.

![Hinh 05 - Ket qua doi chieu](demo-images/05-ket-qua-doi-chieu.png)
Chu thich: Ket qua dia chi cu, moi va thong tin nghi quyet.

![Hinh 06 - Export CSV JSON](demo-images/06-export-csv-json.png)
Chu thich: Nut xuat du lieu phuc vu bao cao.

### 12.3. Anh demo trang chi tiet va ban do
![Hinh 07 - Chi tiet dia chi](demo-images/07-chi-tiet-dia-chi.png)
Chu thich: Thong tin don vi hanh chinh chi tiet.

![Hinh 08 - Ban do vi tri](demo-images/08-ban-do-vi-tri.png)
Chu thich: Marker va polygon tren ban do.

### 12.4. Anh demo auth va tai khoan
![Hinh 09 - Dang nhap](demo-images/09-dang-nhap.png)
Chu thich: Dang nhap email/password.

![Hinh 10 - Dang ky](demo-images/10-dang-ky.png)
Chu thich: Form dang ky tai khoan.

![Hinh 11 - Quen mat khau](demo-images/11-quen-mat-khau.png)
Chu thich: Yeu cau gui mail reset.

![Hinh 12 - Dat lai mat khau](demo-images/12-dat-lai-mat-khau.png)
Chu thich: Dat mat khau moi bang token.

![Hinh 13 - Profile doi mat khau](demo-images/13-profile-doi-mat-khau.png)
Chu thich: Trang thong tin ca nhan va doi mat khau.

### 12.5. Anh demo phan quyen va admin
![Hinh 14 - User khong vao admin](demo-images/14-user-khong-vao-admin.png)
Chu thich: Dieu huong ve trang chu khi khong co quyen.

![Hinh 15 - Trang admin danh sach user](demo-images/15-trang-admin.png)
Chu thich: Giao dien quan ly nguoi dung.

### 12.6. Anh tai lieu API
![Hinh 16 - Trang API docs](demo-images/16-api-docs.png)
Chu thich: Tong hop endpoint va vi du request/response.

---

## 13. Ke hoach cong viec theo tuan (de xuat de bo sung bao cao)

| Tuan | Noi dung chinh | Ket qua |
| --- | --- | --- |
| Tuan 1 | Khoi tao du an Vite + React, tao routing, layout chung | Hoan thanh khung app |
| Tuan 2 | Tich hop auth (login/register), localStorage, cap nhat Header | Dang nhap co ban hoat dong |
| Tuan 3 | Phat trien Home search, dropdown API, ket qua doi chieu | Tra cuu nghiep vu hoat dong |
| Tuan 4 | Tich hop AddressDetail + map Leaflet + fallback geocoding | Hien thi chi tiet va ban do |
| Tuan 5 | Bo sung Forgot/Reset/Profile, phan quyen Admin, API docs | Hoan thien luong auth mo rong |
| Tuan 6 | Toi uu UI responsive, export CSV/JSON, chuan bi demo | Co ban demo doanh nghiep |

Luu y: Bang tren la khung tham khao. Ban co the sua theo dung timeline thuc te.

---

## 14. Danh gia ca nhan thuc tap sinh

### 14.1. Dieu da hoc duoc
- Quy trinh xay dung ung dung frontend theo huong module hoa.
- Tich hop API thuc te va xu ly nhieu kieu response.
- To chuc giao dien responsive ket hop tra cuu nghiep vu.
- Lam viec voi auth flow, JWT va phan quyen route.

### 14.2. Kho khan gap phai
- Du lieu dia gioi phuc tap, dac biet khi map ten hanh chinh voi geocoding.
- Phu thuoc ha tang API va domain OAuth khi demo production.
- Can can doi giua tien do feature va hardening quality.

### 14.3. Huong phat trien ky nang tiep theo
- Nang cao ky nang test frontend (unit/integration/e2e).
- Nang cao ky nang bao mat ung dung web.
- Nang cao kha nang toi uu hieu nang va theo doi runtime.

---

## Ghi chu nop bao cao

- Ban co the xuat file nay sang PDF de nop.
- Nen bo sung logo doanh nghiep o trang bia (neu duoc yeu cau).
- Nen chen anh demo that vao muc 12 de tang tinh thuyet phuc.
- Neu can, bo sung them phan nhan xet cua nguoi huong dan doanh nghiep.
