CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL, -- Tên nhận diện, ví dụ "Server App Giao Hàng"
    status VARCHAR(20) DEFAULT 'active', -- 'active' hoặc 'revoked'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP -- Null = không bao giờ hết hạn
);

-- Tạo Index trên api_key để middleware thao tác tìm kiếm siêu tốc
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(api_key);
