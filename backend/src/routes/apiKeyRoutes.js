const express = require("express");
const router = express.Router();
const apiKeyController = require("../controllers/apiKey.controller");
const usageController = require("../controllers/usage.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Các chức năng này đòi hỏi người dùng phải đăng nhập trên web (sử dụng Token)
router.use(verifyToken);

/**
 * @swagger
 * /api-keys:
 *   get:
 *     summary: Lấy danh sách API Key
 *     tags: [API Key]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", apiKeyController.listKeys);

/**
 * @swagger
 * /api-keys:
 *   post:
 *     summary: Tạo một API Key mới
 *     tags: [API Key]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Server Giao Hàng của Công ty X"
 */
router.post("/", apiKeyController.createKey);

/**
 * @swagger
 * /api-keys/{id}:
 *   delete:
 *     summary: Thu hồi (Revoke) một API Key
 *     tags: [API Key]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete("/:id", apiKeyController.revokeKey);

/**
 * @swagger
 * /api-keys/usage:
 *   get:
 *     summary: Thống kê tổng hợp sử dụng tất cả API Key
 *     tags: [API Key]
 *     security:
 *       - bearerAuth: []
 */
router.get("/usage", usageController.getUsageStats);

/**
 * @swagger
 * /api-keys/{id}/usage/daily:
 *   get:
 *     summary: Thống kê chi tiết theo ngày cho 1 API Key (30 ngày)
 *     tags: [API Key]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id/usage/daily", usageController.getDailyStats);

module.exports = router;
