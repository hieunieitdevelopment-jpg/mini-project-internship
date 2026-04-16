const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

// Tất cả Admin routes đều được bảo vệ kép
router.use(verifyToken, requireAdmin);

/**
 * Lấy số liệu chung và biểu đồ Dashboard (Overview)
 */
router.get("/dashboard", adminController.getDashboardStats);

/**
 * Quản lý Users
 */
router.get("/users", adminController.getUsers);
router.put("/users/:userId/status", adminController.toggleUserStatus);
router.delete("/users/:userId", adminController.deleteUser);

/**
 * Quản lý API Keys toàn hệ thống
 */
router.get("/api-keys", adminController.getAllApiKeys);
router.delete("/api-keys/:keyId", adminController.revokeKeyGlobal);

module.exports = router;
