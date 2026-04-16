const express = require("express");
const router = express.Router();
const suggestController = require("../controllers/suggestController");
const fuzzyController = require("../controllers/fuzzyController");
const { validateSuggest, validateFuzzySearch } = require("../middlewares/validate");
const { optionalAuth } = require("../middlewares/auth.middleware");
const rateLimiter = require("../middlewares/rateLimiter");
const usageLogger = require("../middlewares/usageLogger");


/**
 * @swagger
 * /units/suggest:
 *   get:
 *     summary: Gợi ý đơn vị hành chính (autocomplete)
 *     tags: [Units]
 *     security:
 *       - ApiKeyAuth: []
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
 *       - in: query
 *         name: direction
 *         required: false
 *         schema:
 *           type: string
 *           enum: [old-to-new, new-to-old]
 *         description: Chiều tìm kiếm (cũ sang mới hoặc mới sang cũ)
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
const unitController = require("../controllers/unitController");

router.get("/suggest", optionalAuth, rateLimiter, usageLogger, validateSuggest, suggestController.suggestUnits);
router.get("/:id", optionalAuth, rateLimiter, usageLogger, unitController.getUnitById);

/**
 * @swagger
 * /units/search:
 *   get:
 *     summary: Tìm kiếm gần đúng đơn vị hành chính (fuzzy search)
 *     tags: [Units]
 *     security:
 *       - ApiKeyAuth: []
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
 *       - in: query
 *         name: direction
 *         required: false
 *         schema:
 *           type: string
 *           enum: [old-to-new, new-to-old]
 *         description: Chiều tìm kiếm (cũ sang mới hoặc mới sang cũ)
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
router.get("/search", optionalAuth, rateLimiter, usageLogger, validateFuzzySearch, fuzzyController.fuzzySearch);

module.exports = router;    