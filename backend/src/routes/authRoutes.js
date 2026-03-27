const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, requireAdmin } =  require("../middlewares/auth.middleware");
const { validateRegister, validateLogin, validateChangePassword, validateResetRequest, validateResetPassword} = require("../middlewares/validate");
const passport = require("passport");
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { success: false, message: "Bạn đăng nhập quá nhiều lần thất bại, vui lòng thử lại sau 15 phút"}
});
    



router.post("/register", validateRegister, authController.register);
router.post("/login",loginLimiter, validateLogin, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/change-password", verifyToken, validateChangePassword, authController.changePassword);
router.post("/request-password-reset",loginLimiter, validateResetRequest, authController.requestPasswordReset);
router.post("/reset-password", validateResetPassword, authController.resetPassword);
router.get("/users", verifyToken, requireAdmin, authController.getAllUsers);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/v1/auth/google" }),
    authController.googleCallback
);

module.exports = router;