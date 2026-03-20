const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// middleware xac thuc token
// check header Authorization: Bearer <token>
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Không tìm thấy token, vui lòng đăng nhập", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    // verify token bang secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // gan user info vao req de controller dung
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    console.log("authenticated:", decoded.email);
    next();
  } catch (err) {
    // phan biet token het han vs token sai
    if (err.name === "TokenExpiredError") {
      throw new AppError("Token đã hết hạn, vui lòng đăng nhập lại", 401);
    }
    throw new AppError("Token không hợp lệ", 401);
  }
};

module.exports = authMiddleware;
