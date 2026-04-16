-- Bảng ghi nhật ký sử dụng API theo từng API Key
-- Dùng để thống kê lượt gọi, tính phí và phân tích hành vi đối tác B2B

CREATE TABLE IF NOT EXISTS api_usage_logs (
    id BIGSERIAL PRIMARY KEY,
    api_key_id INTEGER REFERENCES api_keys(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    auth_type VARCHAR(20) NOT NULL DEFAULT 'anonymous',
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL DEFAULT 'GET',
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index tối ưu truy vấn thống kê theo thời gian và theo key
CREATE INDEX IF NOT EXISTS idx_usage_logs_api_key_id ON api_usage_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_endpoint ON api_usage_logs(endpoint);
