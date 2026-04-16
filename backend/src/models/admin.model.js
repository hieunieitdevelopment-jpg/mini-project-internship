const { getClient } = require("../config/db");

const AdminModel = {
    async getGlobalStats() {
        const client = getClient();
        
        // Tổng số users
        const usersResult = await client.query(`SELECT COUNT(*) AS total_users FROM users`);
        
        // Tổng số API Keys (đang active)
        const keysResult = await client.query(`SELECT COUNT(*) AS total_keys FROM api_keys WHERE status = 'active'`);
        
        // Tổng lượt request 24h
        const traffic24hResult = await client.query(`
            SELECT COUNT(*) AS requests_24h 
            FROM api_usage_logs 
            WHERE created_at >= NOW() - INTERVAL '24 hours'
        `);

        // Tổng lượt request 7 ngày
        const traffic7dResult = await client.query(`
            SELECT COUNT(*) AS requests_7d 
            FROM api_usage_logs 
            WHERE created_at >= NOW() - INTERVAL '7 days'
        `);

        return {
            totalUsers: parseInt(usersResult.rows[0].total_users) || 0,
            activeApiKeys: parseInt(keysResult.rows[0].total_keys) || 0,
            requests24h: parseInt(traffic24hResult.rows[0].requests_24h) || 0,
            requests7d: parseInt(traffic7dResult.rows[0].requests_7d) || 0
        };
    },

    async get30DaysTraffic() {
        const client = getClient();
        const result = await client.query(`
            SELECT 
                DATE(created_at) AS date,
                COUNT(*) AS total_requests
            FROM api_usage_logs
            WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);
        return result.rows;
    },

    async getTopConsumers() {
        const client = getClient();
        const result = await client.query(`
            SELECT 
                k.id AS key_id,
                k.name AS key_name,
                k.api_key,
                k.status,
                u.email,
                COUNT(l.id) AS total_requests,
                MAX(l.created_at) AS last_used_at
            FROM api_keys k
            LEFT JOIN users u ON k.user_id = u.id
            LEFT JOIN api_usage_logs l ON k.id = l.api_key_id
            WHERE k.status = 'active'
            GROUP BY k.id, k.name, k.api_key, k.status, u.email
            ORDER BY total_requests DESC
            LIMIT 10
        `);
        return result.rows;
    },

    async getAllUsersWithStats() {
        const client = getClient();
        const result = await client.query(`
            SELECT 
                u.id, u.email, u.username, u.role, u.is_active, u.created_at,
                (SELECT COUNT(*) FROM api_keys WHERE user_id = u.id) AS total_api_keys,
                (SELECT COUNT(*) FROM api_usage_logs WHERE user_id = u.id) AS total_requests
            FROM users u
            ORDER BY u.created_at DESC
        `);
        return result.rows;
    },

    async setUserStatus(userId, isActive) {
        const client = getClient();
        const result = await client.query(
            `UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, email, is_active`,
            [isActive, userId]
        );
        return result.rows[0];
    },

    async getAllApiKeys() {
        const client = getClient();
        const result = await client.query(`
            SELECT 
                k.id, k.name, k.api_key, k.status, k.created_at,
                u.email AS user_email,
                (SELECT COUNT(*) FROM api_usage_logs WHERE api_key_id = k.id) AS total_requests
            FROM api_keys k
            LEFT JOIN users u ON k.user_id = u.id
            ORDER BY k.created_at DESC
        `);
        return result.rows;
    },

    async revokeKeyGlobal(keyId) {
        const client = getClient();
        const result = await client.query(
            `UPDATE api_keys 
             SET status = 'revoked',
                 name = name || ' (Bị Admin khóa)'
             WHERE id = $1 RETURNING *`,
            [keyId]
        );
        return result.rows[0];
    },

    async deleteUser(userId) {
        const client = getClient();
        const result = await client.query(
            `DELETE FROM users WHERE id = $1 RETURNING id, email, username`,
            [userId]
        );
        return result.rows[0];
    }
};

module.exports = AdminModel;
