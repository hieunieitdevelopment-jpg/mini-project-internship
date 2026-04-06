# 📱 VN Address Converter - Update Giao Diện Lên Domain

## 🌐 Domain: https://vngovsync.lozido.com/

---

## 📊 Tổng Thể Kiến Trúc

```
┌─────────────────────────────────────────────────────────────┐
│          Frontend: https://vngovsync.lozido.com             │
│  (Built & Deployed on Netlify - Auto-deploy via GitHub)    │
│                                                              │
│  Repo: Frontend/ → Build → dist/ → Netlify → Live Domain   │
└─────────────────────────────────────────────────────────────┘
                            ↓ API calls
┌─────────────────────────────────────────────────────────────┐
│          Backend: (API routes /api/v1/...)                  │
│  (Deployed on EC2 server - Manual or PM2)                   │
│                                                              │
│  Repo: backend/ → Node.js + Express + PostgreSQL            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Quy Trình Update Giao Diện (Step-by-Step)

### **Step 1: Sửa Code Frontend (Local Machine)**

Bạn làm việc trên máy của bạn:

```bash
# 1. Vào thư mục front
cd Frontend/

# 2. Chạy dev server để test
npm run dev
# → Mở http://localhost:5173 xem thay đổi real-time

# 3. Sửa giao diện
# Ví dụ: chỉnh Login.jsx, Header.jsx, App.css, etc.
# → Dev server tự reload

# 4. Test kỹ lưỡng
# - Click xung quanh
# - Kiểm tra responsive
# - Console check errors
```

### **Step 2: Commit & Push Lên GitHub**

```bash
# Ở thư mục root project
git add Frontend/  (hoặc git add . để add all)
git commit -m "Update footer styling & login page layout"
git push origin develop

# → Push xong, GitHub có thay đổi
```

### **Step 3: Netlify Auto-Deploy (Tự động)**

**Không cần làm gì!** Netlify webhook tự động trigger:

```
GitHub nhận push
    ↓
Netlify webhook trigger
    ↓
Netlify tự động:
  1. Pull code từ GitHub (develop branch)
  2. Chạy: npm run build (tạo dist/)
  3. Deploy dist/ lên Netlify server
  4. Clear cache & invalidate CDN
    ↓
Domain cập nhật! ✅
```

**Thời gian:** 2-5 phút (xem Netlify Dashboard → Deploys)

### **Step 4: Truy Cập Domain Xem Thay Đổi**

```
https://vngovsync.lozido.com/
→ Hard refresh: Ctrl+Shift+Del (clear cache)
→ Thấy UI mới! 🎉
```

---

## 🖥️ Quy Trình Chi Tiết Cho Mỗi Lần Update

```
LOCAL MACHINE                           GITHUB                      NETLIFY                    DOMAIN
┌──────────────────┐                ┌──────────────┐          ┌───────────────┐        ┌──────────────┐
│  1. Sửa code     │                │              │          │               │        │              │
│     Frontend/    │──2. git add.───→              │          │               │        │              │
│  2. Test: npm    │   git commit   │  Repo       │──3.auto──→ Netlify       │─4.CD──→ Live        │
│     run dev      │   git push     │  develop    │   trigger │ Dashboard    │        │            │
│  3. Ctrl+S       │                │              │          │               │        │ URL live!  │
└──────────────────┘                └──────────────┘          └───────────────┘        └──────────────┘
Watching...                       ↑ Push code                Build log              Display
Test changes         commit msg: "Update UI"                 vite build             frontend
in real-time         Branch: develop                          npm run build
```

---

## 📋 File Structure Liên Quan

```
vn-address-converter/
├── Frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx      ← Sửa đăng nhập
│   │   │   ├── Register.jsx   ← Sửa đăng ký
│   │   │   ├── Home.jsx       ← Sửa trang chủ
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── Header.jsx     ← Sửa header navigation
│   │   │   └── Footer.jsx     ← Sửa footer
│   │   └── App.css            ← Sửa CSS global
│   ├── package.json
│   ├── vite.config.js
│   ├── netlify.toml           ← Config Netlify (build rules)
│   └── dist/                  ← Build output (auto generated)
│
├── backend/
│   ├── src/
│   │   ├── server.js          ← Node.js main
│   │   └── routes/            ← API endpoints
│   └── .env                   ← Database config
│
├── .git/
├── NETLIFY_SETUP.md           ← Hướng dẫn Netlify
├── DEPLOYMENT.md              ← Hướng dẫn deployment
└── QUICK_DEPLOY.md            ← Quick start
```

---

## 🎯 Ví Dụ Thực Tế: Update Button Color

### Scenario: Thay đổi nút "Đăng nhập" từ teal → blue

**Step 1: Edit trên local**
```jsx
// Frontend/src/pages/Login.jsx
// Before:
<button className="bg-teal-400 hover:bg-teal-500 ...">Đăng nhập</button>

// After:
<button className="bg-blue-400 hover:bg-blue-500 ...">Đăng nhập</button>

// Save file → npm run dev tự reload → Thấy button xanh blue
```

**Step 2: Commit & Push**
```bash
git add Frontend/src/pages/Login.jsx
git commit -m "Change login button color to blue"
git push origin develop
```

**Step 3: Netlify Auto-Deploy (vài phút)**
- Xem dashboard: https://app.netlify.com → Deployments
- Status: "Building..." → "Published" ✅

**Step 4: Test Domain**
- https://vngovsync.lozido.com/login
- →Button đã xanh blue! 🎉

---

## ⚙️ Cấu Hình Hiện Tại

### Frontend (.env)
```
VITE_API_URL=https://vngovsync.lozido.com/api/v1/auth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_AUTH_CALLBACK_URL=https://vngovsync.lozido.com/api/v1/auth/google/callback
```

### Netlify Config (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub → Netlify Hook
✅ Auto-deploy enabled
- Branch: `develop`
- Build: `npm run build`
- Publish dir: `dist`

---

## 🔍 Kiểm Tra Status Update

### Xem build log Netlify
1. Truy cập: https://app.netlify.com
2. Click site: `vngovsync`
3. Tab: **"Deploys"**
4. Xem status các build gần đây
5. Click vào build để xem logs chi tiết

### Build Status
- 🟢 **Published** = Thành công, live trên domain
- 🟡 **Building** = Đang build, chờ xíu
- 🔴 **Failed** = Có error, check logs & fix code

---

## 🚨 Lưu Ý Quan Trọng

### 1. **Chỉ push branch `develop`**
- Main branch không auto-deploy
- Luôn push `develop` để trigger Netlify

### 2. **Build failed?**
```bash
# Kiểm tra local build trước
npm run build

# Nếu OK local → push lên
# Nếu lỗi → fix code & build lại
```

### 3. **Cache cũ?**
```bash
# Hard refresh browser:
Ctrl+Shift+Delete (Windows) hoặc Cmd+Shift+Delete (Mac)
hoặc Ctrl+F5 / Cmd+Shift+R
```

### 4. **API không work?**
- Frontend (.env) phải point đúng backend URL
- Backend CORS phải allow `https://vngovsync.lozido.com`

---

## 📊 Timeline Từ Push → Live

| Action | Time | Status |
|--------|------|--------|
| `git push` | 0s | ✅ |
| Netlify webhook trigger | 5s | 🔔 |
| Netlify build start | 10s | 🔨 |
| npm run build | 20-30s | 📦 |
| Deploy to CDN | 40s | 🚀 |
| DNS propagate | 1-5 min | 🌍 |
| **Domain live!** | **2-5 min** | **✅ Live** |

---

## 💡 Best Practices

✅ **DO:**
- Test locally trước (`npm run dev`)
- Commit message rõ ràng ("Fix login UI", không "update")
- Push chỉ clean code (không console.log)
- Check Netlify build logs nếu error

❌ **DON'T:**
- Push lên main branch để auto-deploy
- Commit .env files với secrets
- Quên test responsive trên mobile
- Push code không build được local

---

## 🎓 Tóm Tắt Quy Trình

```
Mỗi lần update giao diện:

┌─────────────┐
│ 1. Sửa Code │ ← Bạn làm
│    Local    │
└──────┬──────┘
       ↓
┌─────────────────┐
│ 2. npm run dev  │ ← Test bằng dev server
│    & Test       │
└──────┬──────────┘
       ↓
┌──────────────────────────────┐
│ 3. git add . && git commit   │ ← Commit code
│    git push origin develop   │ ← Push GitHub
└──────┬───────────────────────┘
       ↓ (Webhook auto-trigger)
┌──────────────────────────────┐
│ 4. Netlify Auto-Deploy       │ ← Tự động build & deploy
│    (2-5 minutes)             │
└──────┬───────────────────────┘
       ↓
┌──────────────────────────────┐
│ 5. Domain Live Update! 🎉    │ ← vngovsync.lozido.com
│    https://vngovsync...      │
└──────────────────────────────┘
```

---

**Ready to update?** Sửa gì đó rồi test quy trình này!
