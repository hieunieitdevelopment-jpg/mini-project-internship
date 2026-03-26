const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

// đăng ký tài khoản mới cho người dùng
exports.register = async (req, res, next) => {
    try {
        const { email, password} = req.body;
        const result = await authService.register({ email, password });
        res.status(201).json({ success: true, message: "Đăng ký thành công", data: result });
    } catch (error) {
        next(error);
    }
};

// đăng nhập cho người dùng
exports.login = async (req, res, next ) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        res.status(200).json({success: true, message: "Đăng nhập thành công", data: result });
    } catch (error){
        next(error);
    }

};

// đổi mật khẩu khi đang ở trạng thái đăng nhập
exports.changePassword = async (req, res, next) => {
    try{
        const userId = req.user.id ;
        const { oldPassword, newPassword} = req.body;
        const result = await authService.changePassword ({ userId, oldPassword, newPassword });
        res.status(200).json({success: true, message: "Đổi mật khẩu thành công", data: result });
    } catch (error){
        next(error);
    }

};

// quên mật khẩu -> gửi token reset qua email
exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email} = req.body;
        const result = await authService.requestPasswordReset({ email });
        res.status(200).json({success: true, message: "Đã gửi link requet mật khẩu qua email", data:result});
    } catch (error){
        next(error);
    }

};   

// reset mật khẩu khi đã có token
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const result = await authService.resetPassword({ token, newPassword });
        res.status(200).json({success: true, message: "Đổi mật khẩu thành công", data: result });
    } catch (error){
        next(error);
    }
};  

//admin lấy danh sách tất cả user
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await authService.getAllUsers();
        res.status(200).json({success: true, message: " lấy tất cả user", data:users});
    } catch (error){
        next(error);
    }
};
// xử lý callback sau khi Google xác thực thành công -> tạo JWT và redirect về Frontend
exports.googleCallback = (req, res) => {
    const user = req.user;
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Redirect về Frontend kèm token trên URL
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${FRONTEND_URL}?token=${token}`);
};