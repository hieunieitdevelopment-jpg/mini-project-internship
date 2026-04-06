const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos[0]?.value || null;

        // 1. Kiểm tra user đã đăng nhập Google trước đó chưa
        let user = await userModel.findByGoogleId(profile.id);
        if (user) {
          return done(null, user);
        }

        // 2. Chưa có google_id -> kiểm tra email đã tồn tại chưa (đăng ký thủ công trước đó)
        user = await userModel.findByEmail(email);
        if (user) {
          // Gộp google_id và avatar vào tài khoản cũ
          user = await userModel.updateGoogleId(user.id, profile.id, avatar);
          return done(null, user);
        }

        // 3. Email hoàn toàn mới -> Tạo tài khoản mới
        let username = profile.displayName || email.split("@")[0];
        // Xử lý trùng username (thêm số đuôi nếu bị trùng)
        let baseUsername = username;
        let counter = 2;
        while (await userModel.usernameExists(username)) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        user = await userModel.createGoogleUser({
          username,
          email,
          google_id: profile.id,
          avatar,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;