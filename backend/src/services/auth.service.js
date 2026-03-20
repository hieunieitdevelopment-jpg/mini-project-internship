const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const AppError = require("../utils/AppError");

// dang ky tai khoan moi
exports.register = async ({ username, email, password, fullName, phone }) => {
  // check trung email
  const existEmail = await userModel.findByEmail(email);
  if (existEmail) {
    throw new AppError("Email đã tồn tại", 400);
  }

  // check trung username
  const existUsername = await userModel.findByUsername(username);
  if (existUsername) {
    throw new AppError("Username đã tồn tại", 400);
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("password hashed ok");

  // luu vao db
  const newUser = await userModel.createUser({
    username,
    email,
    hashedPassword,
    fullName,
    phone,
  });

  return newUser;
};

// dang nhap
exports.login = async (email, password) => {
  // tim user theo email
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new AppError("Email hoặc mật khẩu không đúng", 401);
  }

  // so sanh password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Email hoặc mật khẩu không đúng", 401);
  }

  // tao jwt token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

  console.log("đăng nhập thành công:", user.email);

  // tra ve user info + token, bo password
  const { password: pw, ...userInfo } = user;
  return { user: userInfo, token };
};
