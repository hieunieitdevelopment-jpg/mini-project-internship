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

// Lấy thông tin user hiện tại (cần đăng nhập)
router.get("/me", verifyToken, authController.getMe);
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
/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu (cần đăng nhập)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "MyPass@123"
 *               newPassword:
 *                 type: string
 *                 description: "Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
 *                 example: "NewPass@456"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
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
 *                   example: "Đổi mật khẩu thành công"
 *       400:
 *         description: Validation thất bại
 *       401:
 *         description: Chưa đăng nhập hoặc token hết hạn
 */
router.post("/change-password", verifyToken, validateChangePassword, authController.changePassword);
/**
 * @swagger
 * /auth/request-password-reset:
 *   post:
 *     summary: Yêu cầu reset mật khẩu (gửi link qua email)
 *     description: Rate limit 5 lần / 15 phút
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Đã gửi link reset mật khẩu qua email
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
 *                   example: "Đã gửi link reset mật khẩu qua email"
 *       400:
 *         description: Email không hợp lệ
 *       429:
 *         description: Quá nhiều yêu cầu, thử lại sau 15 phút
 */
router.post("/request-password-reset",loginLimiter, validateResetRequest, authController.requestPasswordReset);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset mật khẩu bằng token
 *     description: Dùng token nhận được từ email để đặt mật khẩu mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token nhận từ email
 *                 example: "abc123resettoken"
 *               newPassword:
 *                 type: string
 *                 description: "Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
 *                 example: "NewPass@789"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
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
 *                   example: "Đổi mật khẩu thành công"
 *       400:
 *         description: Token hoặc mật khẩu không hợp lệ
 */
router.post("/reset-password", validateResetPassword, authController.resetPassword);
/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Lấy danh sách tất cả user (chỉ Admin)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách user
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
 *                   example: "lấy tất cả user"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [user, admin]
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền admin
 */
router.get("/users", verifyToken, requireAdmin, authController.getAllUsers);
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Đăng nhập bằng Google OAuth2
 *     description: Redirect đến trang đăng nhập Google. Không gọi trực tiếp từ Swagger, mở bằng trình duyệt.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect đến Google login page
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     description: Google gọi lại URL này sau khi user xác thực. Tạo JWT và redirect về Frontend.
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect về Frontend kèm token
 *       401:
 *         description: Xác thực Google thất bại
 */
router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/v1/auth/google" }),
    authController.googleCallback
);

/**
 * @swagger
 * /auth/google/callback:
 *   post:
 *     summary: Google OAuth2 callback (dành cho Frontend React/Vite)
 *     description: Nhận idToken từ frontend, xác thực và trả về JWT trực tiếp giúp hoàn tất quy trình đăng nhập mà không cần chuyển hướng.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Token nhận từ Google Identity Services
 *     responses:
 *       200:
 *         description: Trả về thông tin đăng nhập thành công
 *       400:
 *         description: Thiếu token hoặc token không hợp lệ
 */
router.post("/google/callback", authController.googleCallbackPost);

module.exports = router;