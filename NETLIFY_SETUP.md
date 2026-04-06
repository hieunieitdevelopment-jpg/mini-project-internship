# 🚀 Deploy Frontend lên Netlify + Custom Domain

## Domain: https://vngovsync.lozido.com/

### 📋 Bước 1: Setup Local (trên máy bạn)

```bash
# Cài Netlify CLI
npm install -g netlify-cli

# Build frontend
cd Frontend
npm run build
```

### 🔗 Bước 2: Connect với GitHub (Recommended)

**Lợi ích:** Auto-deploy mỗi khi push code

1. **Đăng ký/Login Netlify**
   - Truy cập: https://app.netlify.com
   - Click "Sign up" → "Sign up with GitHub"
   - Authorize Netlify access GitHub

2. **Deploy từ Git**
   - Click "Add new site" → "Import an existing project"
   - Select: `hieunieitdevelopment-jpg/vn-address-converter`
   - Branch: `develop`
   - Build command: `npm run build`
   - Publish directory: `Frontend/dist`
   - Click "Deploy site"

3. **Đợi build (2-5 phút)**
   - Netlify sẽ tự build & deploy
   - Bạn sẽ được domain tạm: `something.netlify.app`

### 🌐 Bước 3: Connect Custom Domain

1. **Vào Netlify Dashboard**
   - Click vào site bạn vừa deploy
   - Chọn tab "Domain settings"

2. **Add Custom Domain**
   - Click "Add domain"
   - Nhập domain: `vngovsync.lozido.com`
   - Click "Verify"

3. **Update DNS Records**
   - Netlify sẽ cho 2 tùy chọn:
     - **Option A: Change nameservers** (recommended)
       - Copy nameservers từ Netlify
       - Update tại nhà cung cấp domain (GoDaddy, Route53, etc.)
       - Đợi 24-48h để DNS cập nhật
     
     - **Option B: Setup CNAME record**
       - Add CNAME record trong DNS
       - Name: `www`
       - Value: `your-site.netlify.app`

4. **Kiểm tra**
   - Sau 24h, domain sẽ chỉ đến Netlify
   - HTTPS tự động (Let's Encrypt)
   - Truy cập: https://vngovsync.lozido.com ✅

### 🔄 Đây đó tôi muốn update code sao?

**Tự động!**
```bash
# 1. Sửa code frontend
# 2. Commit & push
git add . && git commit -m "Update UI" && git push

# 3. Netlify tự động build & deploy (2-5 phút)
# Domain cập nhật ngay!
```

**Xem build status:**
- Netlify Dashboard → "Deploys" tab
- Mỗi push sẽ trigger build mới

## 🚨 Lưu ý quan trọng

1. **API URL trong Frontend (.env)**
   ```
   VITE_API_URL=https://api.vngovsync.lozido.com/api/v1/auth
   # Hoặc nếu backend ở server khác
   VITE_API_URL=http://your-backend-url/api/v1/auth
   ```

2. **CORS Setup Backend**
   - Backend cần allow requests từ `https://vngovsync.lozido.com`
   - Cập nhật trong `backend/src/config/` hoặc route cors

3. **Build Success Check**
   - Netlify build logs: Dashboard → Deploys → Build logs
   - Nếu build fail, fix code & push lại

## 📊 Setup Status

- ✅ netlify.toml created (build config)
- ✅ GitHub repo ready
- ⏳ Waiting for you to connect Netlify

## 🎯 Next Steps

1. Tạo account Netlify (free): https://app.netlify.com
2. Follow "Bước 2" → Link GitHub
3. Follow "Bước 3" → Setup custom domain
4. Done! Domain live với auto-deploy ✨

---

**Cần help?** Cho tôi biết step nào bạn bị stuck.
