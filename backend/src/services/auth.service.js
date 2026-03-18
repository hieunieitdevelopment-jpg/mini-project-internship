const bcrypt = require("bcryptjs");
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
