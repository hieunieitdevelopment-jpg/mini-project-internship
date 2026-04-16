const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const ApiKey = require("../models/apiKey.model");

exports.verifyToken = (req, res, next) => {
    try {    
        let token = req.cookies.accessToken;
        console.log("verifyToken - token from cookies:", !!token);
        if(!token){
            const authHeader = req.headers.authorization;
            if(authHeader && authHeader.startsWith("Bearer ")){
                token = authHeader.split(" ")[1];
                console.log("verifyToken - token from Bearer:", !!token);
            }
        }
        if(!token){
            console.log("verifyToken - NO TOKEN FOUND in cookies or headers");
            return res.status(401).json({success: false, message: "Không có token xác thực" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error){
       console.error("verifyToken error:", error.message);
       return res.status(401).json({success: false, message: "Token không hợp lệ hoặc hết hạn" });
    }
};

exports.requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin"){
        return res.status(403).json({success: false, message: "Không có quyền truy cập" });
    }
    next();
};

exports.verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];
        
        if (!apiKey) {
            return res.status(401).json({ success: false, message: "Missing API Key in headers (x-api-key)" });
        }

        const keyData = await ApiKey.findByKey(apiKey);
        
        if (!keyData) {
            return res.status(401).json({ success: false, message: "Invalid API Key" });
        }
        
        if (keyData.status !== 'active') {
            return res.status(403).json({ success: false, message: "API Key has been revoked or is inactive" });
        }
        
        if (!keyData.user_active) {
            return res.status(403).json({ success: false, message: "Tài khoản cha của API Key này đã bị khoá" });
        }

        req.user = { id: keyData.user_id, role: keyData.role, authType: 'api_key' };
        next();
    } catch (error) {
        console.error("API Key Auth Error:", error);
        return res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ trong quá trình xác thực" });
    }
};


exports.verifyApiKeyOrToken = async (req, res, next) => {
    const hasApiKey = !!req.headers['x-api-key'];
    
    if (hasApiKey) {
        return exports.verifyApiKey(req, res, next);
    }
    
    return exports.verifyToken(req, res, next);
};


exports.optionalAuth = async (req, res, next) => {
    const hasApiKey = !!req.headers['x-api-key'];
    const hasToken = !!(req.cookies?.accessToken || 
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")));

    if (hasApiKey) {
        return exports.verifyApiKey(req, res, next);
    }

    if (hasToken) {
        try {
            let token = req.cookies?.accessToken;
            if (!token) {
                token = req.headers.authorization.split(" ")[1];
            }
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (e) {
            req.user = null;
        }
    }
    if (!req.user) {
        req.user = { id: null, role: 'anonymous', authType: 'none' };
    }
    
    next();
};