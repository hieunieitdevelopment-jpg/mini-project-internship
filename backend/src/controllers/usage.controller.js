const UsageLog = require("../models/usageLog.model");

/**
 * GET /api/v1/api-keys/usage
 * Trả về thống kê tổng hợp tất cả API Key của user hiện tại
 */
exports.getUsageStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await UsageLog.getStatsByUser(userId);

        return res.json({
            success: true,
            data: stats.map(s => ({
                key_id: s.key_id,
                key_name: s.key_name,
                status: s.status,
                total_requests: parseInt(s.total_requests) || 0,
                requests_24h: parseInt(s.requests_24h) || 0,
                requests_7d: parseInt(s.requests_7d) || 0,
                avg_response_ms: parseInt(s.avg_response_ms) || 0,
                last_used_at: s.last_used_at,
            })),
        });
    } catch (error) {
        console.error("Usage stats error:", error);
        return res.status(500).json({ success: false, message: "Lỗi tải thống kê sử dụng" });
    }
};

/**
 * GET /api/v1/api-keys/:id/usage/daily
 * Thống kê chi tiết theo ngày cho 1 API Key cụ thể (30 ngày gần nhất)
 */
exports.getDailyStats = async (req, res) => {
    try {
        const apiKeyId = req.params.id;
        const dailyStats = await UsageLog.getDailyStats(apiKeyId);
        const topEndpoints = await UsageLog.getTopEndpoints(apiKeyId);

        return res.json({
            success: true,
            data: {
                daily: dailyStats,
                topEndpoints: topEndpoints,
            },
        });
    } catch (error) {
        console.error("Daily stats error:", error);
        return res.status(500).json({ success: false, message: "Lỗi tải thống kê theo ngày" });
    }
};
