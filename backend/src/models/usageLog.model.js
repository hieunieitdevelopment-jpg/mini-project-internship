const { getClient } = require("../config/db");

const UsageLog = {
    
    async logRequest({ apiKeyId, userId, authType, endpoint, method, statusCode, responseTimeMs, ipAddress, userAgent }) {
        try {
            const client = getClient();
            await client.query(
                `INSERT INTO api_usage_logs (api_key_id, user_id, auth_type, endpoint, method, status_code, response_time_ms, ip_address, user_agent)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [apiKeyId || null, userId || null, authType || "anonymous", endpoint, method, statusCode, responseTimeMs, ipAddress, userAgent]
            );
        } catch (error) {
            // Không throw lỗi - ghi log thất bại không được làm chết request
            console.error("Usage log write failed:", error.message);
        }
    },

   
    async getStatsByUser(userId) {
        const client = getClient();
        const result = await client.query(
            `SELECT 
                ak.id AS key_id,
                ak.name AS key_name,
                ak.status,
                COUNT(ul.id) AS total_requests,
                COUNT(CASE WHEN ul.created_at >= NOW() - INTERVAL '24 hours' THEN 1 END) AS requests_24h,
                COUNT(CASE WHEN ul.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS requests_7d,
                ROUND(AVG(ul.response_time_ms)) AS avg_response_ms,
                MAX(ul.created_at) AS last_used_at
             FROM api_keys ak
             LEFT JOIN api_usage_logs ul ON ul.api_key_id = ak.id
             WHERE ak.user_id = $1
             GROUP BY ak.id, ak.name, ak.status
             ORDER BY total_requests DESC`,
            [userId]
        );
        return result.rows;
    },

   
    async getDailyStats(apiKeyId) {
        const client = getClient();
        const result = await client.query(
            `SELECT 
                DATE(created_at) AS date,
                COUNT(*) AS requests,
                ROUND(AVG(response_time_ms)) AS avg_response_ms
             FROM api_usage_logs
             WHERE api_key_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
             GROUP BY DATE(created_at)
             ORDER BY date DESC`,
            [apiKeyId]
        );
        return result.rows;
    },

    
    async getTopEndpoints(apiKeyId) {
        const client = getClient();
        const result = await client.query(
            `SELECT 
                endpoint,
                COUNT(*) AS hit_count,
                ROUND(AVG(response_time_ms)) AS avg_response_ms
             FROM api_usage_logs
             WHERE api_key_id = $1
             GROUP BY endpoint
             ORDER BY hit_count DESC
             LIMIT 10`,
            [apiKeyId]
        );
        return result.rows;
    },
};

module.exports = UsageLog;
