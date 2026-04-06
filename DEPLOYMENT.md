# DEPLOYMENT GUIDE - vngovsync.lozido.com

## 📋 Yêu cầu
- Node.js v16+ 
- PostgreSQL database
- SSH access to server / AWS account
- Domain DNS already configured

## 🔧 Pre-deployment Setup

### 1. Backend Configuration
```bash
cd backend
# Copy .env.example to .env
cp .env.example .env

# Update .env with production values:
# - DB_HOST: Your PostgreSQL host
# - DB_USER: PostgreSQL username
# - DB_PASSWORD: PostgreSQL password
# - DB_NAME: Database name
# - PORT: 3000 (or your port)
# - JWT_SECRET: Generate a strong secret key
```

### 2. Frontend Configuration
```bash
cd Frontend
# Already built with correct domain in .env
# Built files are in: dist/
```

## 🚀 Deployment Steps

### Option 1: Deploy on Ubuntu/Linux VPS

#### Step 1: SSH into server
```bash
ssh user@vngovsync.lozido.com
```

#### Step 2: Install dependencies
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL (if not already installed)
sudo apt-get install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2
```

#### Step 3: Clone & Setup
```bash
cd /var/www
git clone <your-repo-url> vn-address-converter
cd vn-address-converter/backend

npm install
```

#### Step 4: Database Setup
```bash
# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE address_db;
CREATE USER address_user WITH PASSWORD 'your_secure_password';
ALTER ROLE address_user SET client_encoding TO 'utf8';
ALTER ROLE address_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE address_user SET default_transaction_deferrable TO on;
ALTER ROLE address_user SET default_transaction_read_only TO off;
ALTER ROLE address_user SET default_timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE address_db TO address_user;
\q
EOF

# Run migrations (if applicable)
# npm run migrate
```

#### Step 5: Start Backend with PM2
```bash
cd /var/www/vn-address-converter/backend

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'vn-address-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

#### Step 6: Setup Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace with:
```nginx
server {
    listen 80;
    server_name vngovsync.lozido.com;
    client_max_body_size 50M;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vngovsync.lozido.com;
    client_max_body_size 50M;

    # SSL certificates (using Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/vngovsync.lozido.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vngovsync.lozido.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;

    # API Routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files & Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Test & reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 7: Setup SSL (Let's Encrypt)
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d vngovsync.lozido.com
```

### Option 2: Deploy on AWS

#### Using S3 + CloudFront (Frontend only)
```bash
# Build already done
# Upload dist/ to S3 bucket

# Configure S3:
# 1. Create S3 bucket
# 2. Enable static website hosting
# 3. Upload contents of dist/
# 4. Setup CloudFront distribution

# Deploy backend on EC2
# (Follow VPS steps above)
```

#### Or use Elastic Beanstalk (Full Stack)
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init -p node.js-18 vn-address-converter --region ap-southeast-1

# Create environment
eb create production

# Deploy
eb deploy
```

## 🔍 Verification

After deployment, verify everything:

```bash
# Check API is accessible
curl -X GET https://vngovsync.lozido.com/api/v1/auth/status

# Check frontend loads
curl -X GET https://vngovsync.lozido.com/

# Check PM2 status
pm2 status

# Check logs
pm2 logs vn-address-api
```

## 📊 Monitoring & Maintenance

### PM2 Monitoring
```bash
pm2 monit
pm2 logs --lines 1000
```

### Nginx Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup
```bash
sudo -u postgres pg_dump address_db > backup-$(date +%Y%m%d).sql
```

## 🔐 Security Checklist

- [ ] Database password is strong
- [ ] JWT secret is strong and unique
- [ ] SSL/TLS certificates configured
- [ ] Firewall rules configured (only 80, 443 open)
- [ ] Database has backups enabled
- [ ] Environment variables are secure
- [ ] CORS origin is set correctly
- [ ] Rate limiting enabled on API

## 📝 Environment Variables Reference

### Backend (.env)
```
DB_HOST=localhost
DB_USER=address_user
DB_PASSWORD=secure_password
DB_NAME=address_db
DB_PORT=5432
PORT=3000
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://vngovsync.lozido.com/api/v1/auth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_AUTH_CALLBACK_URL=https://vngovsync.lozido.com/api/v1/auth/google/callback
```

## 🆘 Troubleshooting

### Cannot connect to database
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
sudo -u postgres psql -l
```

### PM2 crashes
```bash
# Check logs
pm2 logs vn-address-api

# Restart
pm2 restart vn-address-api
```

### 502 Bad Gateway
```bash
# Check backend is running
pm2 status

# Check Nginx upstream
sudo nginx -t
```

---

**Last Updated:** 2026-04-06
