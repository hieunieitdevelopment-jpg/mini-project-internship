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
    



/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới cho người dùng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: " tối thiểu 8 ký tự , gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
 *                 example: "Mypass@123"
 *     responses:
 *       201:
 *         description: "tài khoản đăng ký thành công"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true 
 *                 message:
 *                   type: string
 *                   example: " Đăng ký thành công "
 *                 data:
 *                   type: object
 *       400: 
 *         description: validation thất bại ( email hoặc password không hợp lệ)
 *       409: 
 *         description: email đã tồn tại
 *       500: 
 *         description: lỗi server
 */
router.post("/register", validateRegister, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập tài khoản cho người dùng
 *     description: Đăng nhập và nhận token qua httpOnly cookie. Rate limit 5 lần/15 phút
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "Mypass@123"
 *     responses:
 *       200:
 *         description: "Đăng nhập thành công (accessToken và refreshToken được set qua cookie)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true 
 *                 message:
 *                   type: string
 *                   example: " Đăng nhập thành công "
 *                 data:
 *                   type: object
 *                   description: "Thông tin user ( không bao gồm passwword)"
 *       400: 
 *         description: validation thất bại ( email hoặc password không hợp lệ)
 *       401: 
 *         description: email hoặc password không đúng
 *       429: 
 *         description: "Bạn đăng nhập quá nhiều lần thất bại, vui lòng thử lại sau 15 phút"
 *       
 */
router.post("/login",loginLimiter, validateLogin, authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Cấp access token mới
 *     description: Sử dụng refreshToken từ cookie để lấy accessToken mới. Không cần body.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Refresh thành công (accessToken mới được set qua cookie)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Refresh token thành công"
 *                 data:
 *                   type: object
 *       401:
 *         description: Không có refresh token hoặc token không hợp lệ
 */
router.post("/refresh-token", authController.refreshToken);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     description: Xóa accessToken và refreshToken khỏi cookie. Không cần body.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Đăng xuất thành công"
 */
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