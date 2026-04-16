const UsageLog = require("../models/usageLog.model");
const ApiKey = require("../models/apiKey.model");

const usageLogger = async (req, res, next) => {
    const startTime = Date.now();
    res.on("finish", async () => {
        try {
            const responseTimeMs = Date.now() - startTime;
            const authType = req.user?.authType || "none";

            if (authType === "none" || !req.user?.id) return;

            let apiKeyId = null;
            if (authType === "api_key" && req.headers["x-api-key"]) {
                const keyData = await ApiKey.findByKey(req.headers["x-api-key"]);
                if (keyData) apiKeyId = keyData.id;
            }

            const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
            const userAgent = req.headers["user-agent"] || "";

            UsageLog.logRequest({
                apiKeyId,
                userId: req.user.id,
                authType,
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                responseTimeMs,
                ipAddress: ip,
                userAgent: userAgent.substring(0, 500),
            });
        } catch (error) {
            console.error("Usage logger error:", error.message);
        }
    });

    next();
};

module.exports = usageLogger;
