const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
    try {    
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({success: false, message: "Không có token xác thực" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error){
       return  res.status(401).json({success: false, message: "Token không hợp lệ hoặc hết hạn" });
    }
};

exports.requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin"){
        return res.status(403).json({success: false, message: "Không có quyền truy cập" });
    }
    next();
};