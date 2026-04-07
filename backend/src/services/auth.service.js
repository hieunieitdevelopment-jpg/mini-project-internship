const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const AppError = require("../utils/AppError");

const userModel = require("../models/user.model");

const passwordResetModel = require("../models/passwordReset.model");
const refreshTokenModel = require("../models/refreshToken.model");

const emailService = require("./email.service");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;


// người dùng đăng ký tài khoản mới
exports.register = async ({ email, password }) => {
    const exists = await userModel.emailExists(email);
    if (exists) {
        throw new AppError("Email đã tồn tại", 409);
    }
    let username = email.split('@')[0];
    let counter = 2;
    while (await
        userModel.usernameExists(username)) {
        username = `${email.split('@')[0]}${counter}`;
        counter++;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({ username, email, hashedPassword });
    if (user.password) delete user.password;
    return { user };
};

// người dùng đăng nhập
exports.login = async ({ email, password }) => {
    const user = await userModel.findByEmail(email);
    if (!user) {
        throw new AppError("Email hoặc mật khẩu không đúng", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError("Email hoặc mật khẩu không đúng", 401);
    }
    if (!user.is_active) {
        throw new AppError("Tài khoản đã bị khóa", 403);
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshTokenModel.createRefreshToken(user.id, refreshToken, expiresAt);
    delete user.password;
    return { user, token, accessToken, refreshToken };
};

// cấp Access token mới từ refresh token
exports.refreshToken = async ({ refreshToken }) => {
    const tokenRecord = await refreshTokenModel.findValidToken(refreshToken);
    if (!tokenRecord) {
        throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn", 401);
    }
    const user = await userModel.findById(tokenRecord.user_id);
    if (!user || !user.is_active) {
        throw new AppError("Tài khoản không tồn tại hoặc đã bị xóa", 401);
    }
    // xóa token cũ 
    await refreshTokenModel.deleteRefreshToken(refreshToken);
    // tạo token mới
    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshTokenModel.createRefreshToken(user.id, newRefreshToken, expiresAt);
    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    return { accessToken, refreshToken: newRefreshToken };
};

// đăng xuất - xóa refresh token khỏi db
exports.logout = async ({ refreshToken }) => {
        await refreshTokenModel.deleteRefreshToken(refreshToken);
    return { message: "Đăng xuất thành công" };
};




// đổi mật khẩu khi đã đăng nhập
exports.changePassword = async ({ userId, oldPassword, newPassword }) => {
    const user = await userModel.findByIdWithPassword(userId);
    if (!user) {
        throw new AppError("Không tìm thấy tài khoản", 404);
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new AppError("Mật khẩu cũ không đúng", 401);
    }
    if (oldPassword === newPassword) {
        throw new AppError("Mật khẩu mới không được trùng với mật khẩu cũ", 400);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await refreshTokenModel.deleteAllByUserId(userId);
    await userModel.updatePassword(userId, hashedPassword);
    return { message: "Đổi mật khẩu thành công" };
};

// User quên mật khẩu -> gửi token reset qua link

exports.requestPasswordReset = async ({ email }) => {
    const user = await userModel.findByEmail(email);
    if (user) {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await passwordResetModel.createPasswordReset(email, token, expiresAt);
        // gửi email bất đồng bộ (fire-and-forget) - không chờ SMTP, API trả response ngay
        emailService.sendPasswordResetEmail(email, token).catch(err => {
            console.error("[EMAIL ERROR] Gửi email reset thất bại:", err.message);
        });
    }
    return { message: "Nếu email của bạn tồn tại trong hệ thống , chúng tôi sẽ gửi link để đặt lại mật khẩu" };
};

// User click link reset -> nhập mật khẩu mới
exports.resetPassword = async ({ token, newPassword }) => {
    const resetRecord = await passwordResetModel.findValidToken(token);
    if (!resetRecord) {
        throw new AppError("Token không hợp lệ hoặc đã hết hạn", 400);
    }
    const user = await userModel.findByEmail(resetRecord.email);
    if (!user) {
        throw new AppError("Không tìm thấy tài khoản", 404);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(user.id, hashedPassword);
    await refreshTokenModel.deleteAllByUserId(user.id);
    await passwordResetModel.markTokenAsUsed(token);
    return { message: "Đổi mật khẩu thành công" };
};

// lấy tất cả user
 exports.getAllUsers = async () => {
    const users = await userModel.getAllUsers();
    return users;
 };

// Đăng nhập / Đăng ký trực tiếp qua Google idToken
exports.googleLoginOrRegister = async ({ idToken }) => {
    if (!idToken) {
        throw new AppError("Thiếu idToken", 400);
    }
    
    // Xác thực chữ ký token từ Google
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: google_id, email, name: username, picture: avatar } = payload;
    
    // 1. Kiểm tra user đã tồn tại qua google_id chưa
    let user = await userModel.findByGoogleId(google_id);
    
    if (!user) {
        // 2. Chư có -> Kiểm tra xem email này đã đăng ký thường chưa
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            // Có email -> Cập nhật google_id và avatar để gộp tài khoản
            user = await userModel.updateGoogleId(existingUser.id, google_id, avatar);
        } else {
            // 3. Chưa có gì -> Đăng ký mới tài khoản bằng Google
            user = await userModel.createGoogleUser({ username, email, google_id, avatar });
        }
    }
    
    // 4. Kiểm tra trạng thái tài khoản
    if (!user.is_active) {
        throw new AppError("Tài khoản đã bị khóa", 403);
    }
    
    // 5. Sinh tokens
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await refreshTokenModel.createRefreshToken(user.id, refreshToken, expiresAt);
    
    if (user.password) {
        delete user.password;
    }
    
    return { user, token, accessToken, refreshToken };
};
