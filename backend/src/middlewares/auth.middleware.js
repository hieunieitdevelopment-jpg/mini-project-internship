const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
    try {    
        let token = req.cookies.accessToken;
        if(!token){
            const authHeader = req.headers.authorization;
            if(authHeader && authHeader.startsWith("Bearer ")){
                token = authHeader.split(" ")[1];
            }
        }
        if(!token){
            return res.status(401).json({success: false, message: "Không có token xác thực" });
        }
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