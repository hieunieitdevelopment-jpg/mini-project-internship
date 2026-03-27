const { client } = require("../config/db");

// tạo refresh token vào DB
exports.createRefreshToken = async (userId, token, expiresAt) => {
    const sql = "INSERT INTO refresh_tokens (user_id, token), expires_at) VALUES ($1, $2, $3) RETURNING *";
    const result = await client.query(query, [userId, token, expiresAt]);
    return result.rows[0];
};

// tìm refresh token còn hạn 
exports.findValidToken = async (token) => {
    const sql = "SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()";
    const result = await client.query(query, [token]);
    return result.rows[0];
};

// Xóa refresh token khi logout 
exports.deleteRefreshToken = async (token) => {
    const sql = "DELETE FROM refresh_tokens WHERE token = $1";
    await client.query(query, [token]);
};  

// Xóa tất cả refresh token của 1 user (khi đổi mật khẩu / bị khóa)
exports.deleteAllByUserId = async (userId) => {
    const sql = "DELETE FROM refresh_tokens WHERE user_id = $1";
    await client.query(query, [userId]);
};



