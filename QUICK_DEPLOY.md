# 🚀 Quick Start - Deploy to vngovsync.lozido.com

## ⚡ Tóm tắt nhanh

### Bước 1: Chuẩn bị (Lần đầu)
```bash
# Backend setup
cd backend
npm install
# Cấu hình .env với:
# - Database credentials
# - JWT_SECRET
# - PORT=3000

# Frontend build
cd ../Frontend
npm install
npm run build
```

### Bước 2: Build Frontend vào Backend
```bash
# Tự động copy vào backend/public (đã làm rồi)
# Giờ backend sẽ serve cả frontend + API
```

### Bước 3: Deploy lên Server

#### Nếu có Server/VPS riêng:
```bash
# SSH vào server
ssh user@vngovsync.lozido.com

# Clone repo
git clone https://github.com/hieunieitdevelopment-jpg/vn-address-converter.git
cd vn-address-converter/backend

# Cài dependencies
npm install

# Cấu hình .env (database, JWT)
nano .env

# Start server (production)
PORT=3000 NODE_ENV=production npm start

# Hoặc dùng PM2
npm install -g pm2
pm2 start src/server.js --name "vn-address-api"
pm2 startup
pm2 save
```

#### Nếu dùng AWS:
- Tạo EC2 instance, rồi follow VPS steps ở trên
- Hoặc dùng Elastic Beanstalk (xem DEPLOYMENT.md)

### Bước 4: Setup Nginx (Reverse Proxy)
```bash
# Thay đổi DNS record DNS bạn:
# vngovsync.lozido.com → IP server

# Cấu hình Nginx
# (Xem DEPLOYMENT.md mục "Setup Nginx Reverse Proxy")
```

## 📋 Checklist Deployment

- [ ] .env backend configured (DB, JWT_SECRET)
- [ ] .env frontend configured (VITE_API_URL)
- [ ] `npm run build` chạy thành công
- [ ] backend/public/ có dist files
- [ ] Database created & migrated
- [ ] Server SSH access ready
- [ ] Domain DNS pointing to server
- [ ] Nginx configured
- [ ] SSL certificate (Let's Encrypt) installed
- [ ] PM2 running backend
- [ ] Test: curl https://vngovsync.lozido.com/api/v1/auth

## 🔧 Key Config Files

| File | Purpose |
|------|---------|
| `backend/.env` | Database, JWT config |
| `Frontend/.env` | API URL config |
| `DEPLOYMENT.md` | Full deployment guide |
| `backend/public/` | Frontend built files |

## 📖 Full Guide

Xem chi tiết đầy đủ trong: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## ⚠️ Lưu ý quan trọng

1. **Change default values:**
   - Database password
   - JWT_SECRET
   - Google OAuth credentials

2. **Database:**
   - Chắc chắn PostgreSQL running
   - User/password correct
   - Database tables created

3. **Security:**
   - HTTPS/SSL enabled
   - Firewall rules configured
   - Environment variables protected

4. **Monitoring:**
   ```bash
   pm2 logs          # View logs
   pm2 status        # Check status
   pm2 restart all   # Restart if needed
   ```

---

**Repository:** https://github.com/hieunieitdevelopment-jpg/vn-address-converter
**Domain:** vngovsync.lozido.com
