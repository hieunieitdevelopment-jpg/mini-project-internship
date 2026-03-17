const express = require("express");
const router = express.Router();
const dropdownController = require("../controllers/dropdownController");

/**
 * @swagger
 * /districts/{districtId}/wards:
 *   get:
 *     summary: Lấy danh sách xã/phường theo huyện
 *     tags: [Dropdown]
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của quận/huyện
 *     responses:
 *       200:
 *         description: Danh sách xã/phường
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
router.get("/:districtId/wards", dropdownController.getWards);

module.exports = router;
