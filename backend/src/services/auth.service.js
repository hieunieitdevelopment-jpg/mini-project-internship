const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = require("../models/user.model");

const passwordResetModel = require("../models/passwordReset.model");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;


// người dùng đăng ký tài khoản mới
exports.register = async ({ email, password }) => {
    const exists = await userModel.emailExists(email);
    if (exists) {
        throw new Error(" Email đã tồn tại");
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
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return { user, token };
};

// người dùng đăng nhập
exports.login = async ({ email, password }) => {
    const user = await userModel.findByEmail(email);
    if (!user) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Email hoặc mật khẩu không đúng");
    }
    if (!user.is_active) {
        throw new Error("Tài khoản đã bị khóa");
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    delete user.password;
    return { user, token };
};

// đổi mật khẩu khi đã đăng nhập
exports.changePassword = async ({ userId, oldPassword, newPassword }) => {
    const user = await userModel.findByIdWithPassword(userId);
    if (!user) {
        throw new Error("Không tìm thấy tài khoản");
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu cũ không đúng");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(userId, hashedPassword);
    return { message: "Đổi mật khẩu thành công" };
};

// User quên mật khẩu -> gửi token reset qua link

exports.requestPasswordReset = async ({ email }) => {
    const user = await userModel.findByEmail(email);
    if (!user) {
        throw new Error(" không tìm thấy tài khoản");
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await passwordResetModel.createPasswordReset(email, token, expiresAt);
    // todo gửi email chứa link reset (cài nodemailer sau)
    return { message: "Token reset đã được tạo", token };
};

// User click link reset -> nhập mật khẩu mới
exports.resetPassword = async ({ token, newPassword }) => {
    const resetRecord = await passwordResetModel.findValidToken(token);
    if (!resetRecord) {
        throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }
    const user = await userModel.findByEmail(resetRecord.email);
    if (!user) {
        throw new Error("Không tìm thấy tài khoản");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(user.id, hashedPassword);
    await passwordResetModel.markTokenAsUsed(token);
    return { message: "Đổi mật khẩu thành công" };
};

// lấy tất cả user
 exports.getAllUsers = async () => {
    const users = await userModel.getAllUsers();
    return users;
 };

