const authService = require("../services/auth.service");

// dang ky user moi
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, full_name, phone } = req.body;

    const user = await authService.register({
      username,
      email,
      password,
      fullName: full_name,
      phone,
    });

    console.log("đăng ký thành công:", user.email);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// dang nhap
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await authService.login(email, password);

    console.log("đăng nhập thành công:", user.email);
    res.status(200).json({ success: true, data: { user, token } });
  } catch (err) {
    next(err);
  }
};

// dang nhap / dang ky bang google
exports.googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const { user, token, isNewUser } = await authService.googleAuth(idToken);

    res.status(200).json({ success: true, data: { user, token, isNewUser } });
  } catch (err) {
    next(err);
  }
};
