const express = require("express");
const router = express.Router();
const convertController = require("../controllers/convertController");
const suggestController = require("../controllers/suggestController");
const fuzzyController = require("../controllers/fuzzyController");


// ============== CONVERT ==============

// GET /api/v1/address/convert/old-to-new
router.get("/convert/old-to-new", convertController.convertOldToNew);

// GET /api/v1/address/convert/new-to-old
router.get("/convert/new-to-old", convertController.convertNewToOld);

// ============== SUGGEST (Gợi ý nhanh) ==============

// GET /api/v1/address/suggest?q=keyword&level=ward
router.get("/suggest", suggestController.suggestUnits);

// ============== FUZZY SEARCH (Tìm gần đúng) ==============

// GET /api/v1/address/fuzzy-search?q=keyword&level=ward
router.get("/fuzzy-search", fuzzyController.fuzzySearch);


module.exports = router;