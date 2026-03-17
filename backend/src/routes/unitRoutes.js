const express = require("express");
const router = express.Router();
const suggestController = require("../controllers/suggestController");
const fuzzyController = require("../controllers/fuzzyController");

/**
 * @swagger
 * /units/suggest:
 *   get:
 *     summary: Gợi ý đơn vị hành chính (autocomplete)
 *     tags: [Units]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *         example: Đắk
 *       - in: query
 *         name: level
 *         required: false
 *         schema:
 *           type: string
 *           enum: [province, district, ward]
 *         description: Cấp đơn vị hành chính
 *     responses:
 *       200:
 *         description: Danh sách gợi ý
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
 *                       level:
 *                         type: string
 *                       is_active:
 *                         type: boolean
 *                       parent:
 *                         type: string
 *                       grandparent:
 *                         type: string
 *       400:
 *         description: Thiếu từ khóa hoặc level không hợp lệ
 */
router.get("/suggest", suggestController.suggestUnits);

/**
 * @swagger
 * /units/search:
 *   get:
 *     summary: Tìm kiếm gần đúng đơn vị hành chính (fuzzy search)
 *     tags: [Units]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *         example: Đắk
 *       - in: query
 *         name: level
 *         required: false
 *         schema:
 *           type: string
 *           enum: [province, district, ward]
 *         description: Cấp đơn vị hành chính
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm kèm điểm tương đồng và mapping
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
 *                       unit:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           code:
 *                             type: string
 *                           level:
 *                             type: string
 *                           is_active:
 *                             type: boolean
 *                           parent:
 *                             type: string
 *                           grandparent:
 *                             type: string
 *                       score:
 *                         type: string
 *                         description: Điểm tương đồng
 *                       mapping:
 *                         type: object
 *                         nullable: true
 *                         description: Thông tin mapping nếu có
 *       400:
 *         description: Thiếu từ khóa hoặc level không hợp lệ
 */
router.get("/search", fuzzyController.fuzzySearch);

module.exports = router;
