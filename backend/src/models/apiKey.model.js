const { client } = require("../config/db");

exports.createApiKey = async (userId, apiKey, name) => {
    const sql = `
        INSERT INTO api_keys (user_id, api_key, name) 
        VALUES ($1, $2, $3) 
        RETURNING id, name, status, created_at
    `;
    const result = await client.query(sql, [userId, apiKey, name]);
    return result.rows[0];
};

exports.getKeysByUserId = async (userId) => {
    const sql = `
        SELECT id, api_key, name, status, created_at, expires_at 
        FROM api_keys 
        WHERE user_id = $1 
        ORDER BY created_at DESC
    `;
    const result = await client.query(sql, [userId]);
    return result.rows;
};

exports.countActiveKeysByUser = async (userId) => {
    const sql = "SELECT COUNT(*) FROM api_keys WHERE user_id = $1 AND status = 'active'";
    const result = await client.query(sql, [userId]);
    return parseInt(result.rows[0].count, 10);
};

exports.revokeKey = async (keyId, userId) => {
    const sql = `
        UPDATE api_keys 
        SET status = 'revoked' 
        WHERE id = $1 AND user_id = $2 
        RETURNING id, name, status
    `;
    const result = await client.query(sql, [keyId, userId]);
    return result.rows[0];
};

exports.findByKey = async (apiKey) => {
    const sql = `
        SELECT 
            ak.id AS key_id, 
            ak.status, 
            ak.user_id, 
            u.role, 
            u.is_active AS user_active
        FROM api_keys ak
        JOIN users u ON ak.user_id = u.id
        WHERE ak.api_key = $1
    `;
    const result = await client.query(sql, [apiKey]);
    return result.rows[0] || null;
};
