const redis = require("../config/redis");

/**
 * Rate Limiter Middleware sử dụng Redis
 * 
 * Phân loại giới hạn theo loại người dùng:
 * - API Key (B2B):     100 requests / phút
 * - JWT (Đăng nhập):    60 requests / phút  
 * - Anonymous (Guest):  30 requests / phút
 * 
 * Header trả về: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
 */

const RATE_LIMITS = {
    api_key: { max: 100, windowSeconds: 60 },
    jwt:     { max: 60,  windowSeconds: 60 },
    anonymous: { max: 30, windowSeconds: 60 },
};

const rateLimiter = async (req, res, next) => {
    try {
        // Xác định danh tính và loại người dùng
        let identifier;
        let userType;

        if (req.user?.authType === "api_key") {
            identifier = `ratelimit:apikey:${req.headers["x-api-key"]}`;
            userType = "api_key";
        } else if (req.user?.id && req.user.authType !== "none") {
            identifier = `ratelimit:user:${req.user.id}`;
            userType = "jwt";
        } else {
            // Anonymous - dùng IP
            const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            identifier = `ratelimit:ip:${ip}`;
            userType = "anonymous";
        }

        const limit = RATE_LIMITS[userType];
        
        const currentCount = await redis.incr(identifier);

        if (currentCount === 1) {
            await redis.expire(identifier, limit.windowSeconds);
        }

        const ttl = await redis.ttl(identifier);
        const remaining = Math.max(0, limit.max - currentCount);

        // Gắn thông tin Rate Limit vào Response Header
        res.set({
            "X-RateLimit-Limit": String(limit.max),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(ttl),
            "X-RateLimit-Type": userType,
        });

        if (currentCount > limit.max) {
            return res.status(429).json({
                success: false,
                message: `Bạn đã vượt quá giới hạn ${limit.max} requests/${limit.windowSeconds}s. Vui lòng thử lại sau ${ttl} giây.`,
                retryAfter: ttl,
            });
        }

        next();
    } catch (error) {
        console.error("Rate Limiter Error:", error.message);
        next();
    }
};

module.exports = rateLimiter;
