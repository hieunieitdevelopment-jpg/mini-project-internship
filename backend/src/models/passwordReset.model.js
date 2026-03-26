const { client } = require("../config/db");

// Lưu token reset vào DB khi user yêu cầu quên mật khẩu
exports.createPasswordReset = async (email, token, expiresAt) => {
    const sql = "INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3) RETURNING id, email, token, expires_at, created_at";
    const result = await client.query(sql, [email, token, expiresAt]);
    return result.rows[0];
};

// Tìm token còn hạn + chưa dùng (khi user click link reset)
exports.findValidToken = async (token) => {
    const sql = "SELECT * FROM password_resets WHERE token = $1 AND used = FALSE AND expires_at > NOW()";
    const result = await client.query(sql, [token]);
    return result.rows[0] || null;
};

// Đánh dấu token đã dùng (sau khi reset mật khẩu thành công)
exports.markTokenAsUsed = async (token) => {
    const sql = "UPDATE password_resets SET used = TRUE WHERE token = $1 RETURNING id, email, token, expires_at, created_at";
    const result = await client.query(sql, [token]);
    return result.rows[0];
};  

