const express = require("express");
const router = express.Router();
const dropdownController = require("../controllers/dropdownController");

/**
 * @swagger
 * /provinces:
 *   get:
 *     summary: Lấy danh sách tỉnh/thành phố
 *     tags: [Dropdown]
 *     responses:
 *       200:
 *         description: Danh sách tỉnh/TP đang hoạt động
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
 */
router.get("/", dropdownController.getProvinces);

/**
 * @swagger
 * /provinces/{provinceId}/districts:
 *   get:
 *     summary: Lấy danh sách quận/huyện theo tỉnh
 *     tags: [Dropdown]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tỉnh/thành phố
 *     responses:
 *       200:
 *         description: Danh sách quận/huyện
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
 */
router.get("/:provinceId/districts", dropdownController.getDistricts);

module.exports = router;
