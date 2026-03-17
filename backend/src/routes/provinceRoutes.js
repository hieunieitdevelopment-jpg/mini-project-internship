const express = require("express");
const router = express.Router();
const dropdownController = require("../controllers/dropdownController");
const { validateProvinceId } = require("../middlewares/validate");

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
router.get("/:provinceId/districts", validateProvinceId, dropdownController.getDistricts);

/**
 * @swagger
 * /provinces/{provinceId}/wards:
 *   get:
 *     summary: Lấy danh sách xã/phường theo tỉnh (bỏ qua huyện)
 *     tags: [Dropdown]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tỉnh/thành phố
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Lấy xã active (mới) hay inactive (cũ)
 *     responses:
 *       200:
 *         description: Danh sách xã/phường thuộc tỉnh
 */
router.get("/:provinceId/wards", validateProvinceId, dropdownController.getWardsByProvince);

module.exports = router;
