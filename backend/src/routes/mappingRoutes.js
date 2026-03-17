const express = require("express");
const router = express.Router();
const mappingController = require("../controllers/mappingController");

/**
 * @swagger
 * /mappings:
 *   get:
 *     summary: Tra cứu mapping thay đổi đơn vị hành chính
 *     tags: [Mappings]
 *     parameters:
 *       - in: query
 *         name: direction
 *         required: true
 *         schema:
 *           type: string
 *           enum: [old-to-new, new-to-old]
 *         description: Chiều tra cứu (cũ sang mới hoặc mới sang cũ)
 *       - in: query
 *         name: province
 *         required: false
 *         schema:
 *           type: string
 *         description: Tên tỉnh/thành phố
 *         example: Đắk
 *       - in: query
 *         name: district
 *         required: false
 *         schema:
 *           type: string
 *         description: Tên quận/huyện
 *         example: Krông
 *       - in: query
 *         name: ward
 *         required: false
 *         schema:
 *           type: string
 *         description: Tên xã/phường
 *         example: Phú Lộc
 *     responses:
 *       200:
 *         description: Kết quả mapping
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
 *                       old_unit:
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
 *                           parent:
 *                             type: string
 *                           grandparent:
 *                             type: string
 *                       new_unit:
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
 *                       change:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           resolution_number:
 *                             type: string
 *                           description:
 *                             type: string
 *                           effective_date:
 *                             type: string
 *                             format: date-time
 *       400:
 *         description: Thiếu direction hoặc không truyền thông tin tìm kiếm
 */
router.get("/", mappingController.getMappings);

module.exports = router;
