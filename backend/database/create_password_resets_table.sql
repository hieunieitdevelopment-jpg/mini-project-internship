-- Bảng này lưu token reset mật khẩu khi user quên mật khẩu.
CREATE TABLE password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);


-- Thêm index để tăng tốc độ tìm kiếm email
CREATE INDEX idx_password_resets_email ON password_resets(email);

