const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const userModel = require("../models/user.model");
const AppError = require("../utils/AppError");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateJwtToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

const removePasswordField = (user) => {
  const { password: pw, ...userInfo } = user;
  return userInfo;
};

const normalizeUsername = (value) => {
  const base = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 40);
  return base || "user";
};

const buildUniqueUsername = async (seed) => {
  const base = normalizeUsername(seed);
  let candidate = base;
  let count = 0;

  while (true) {
    const found = await userModel.findByUsername(candidate);
    if (!found) return candidate;

    count += 1;
    const suffix = String(count);
    candidate = `${base.slice(0, 40 - suffix.length)}${suffix}`;
  }
};

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
  const token = generateJwtToken(user);

  console.log("đăng nhập thành công:", user.email);

  // tra ve user info + token, bo password
  const userInfo = removePasswordField(user);
  return { user: userInfo, token };
};

// dang nhap / dang ky bang google
exports.googleAuth = async (idToken) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new AppError("Thiếu cấu hình GOOGLE_CLIENT_ID", 500);
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    throw new AppError("Google token không hợp lệ", 401);
  }

  const email = payload?.email;
  if (!email || payload?.email_verified !== true) {
    throw new AppError("Tài khoản Google chưa xác minh email", 401);
  }

  let user = await userModel.findByEmail(email);
  let isNewUser = false;

  if (!user) {
    const usernameSeed = payload?.name || email.split("@")[0];
    const username = await buildUniqueUsername(usernameSeed);
    const fullName = payload?.name || email.split("@")[0];

    const randomPassword = crypto.randomBytes(32).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    user = await userModel.createUser({
      username,
      email,
      hashedPassword,
      fullName,
      phone: null,
    });
    isNewUser = true;
  }

  const token = generateJwtToken(user);
  const userInfo = removePasswordField(user);

  return { user: userInfo, token, isNewUser };
};
