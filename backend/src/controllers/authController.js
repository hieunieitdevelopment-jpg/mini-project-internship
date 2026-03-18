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

    console.log("register thanh cong:", user.email);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
