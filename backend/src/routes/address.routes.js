const express = require("express");
const router = express.Router();

const addressController = require("../controllers/address.controller");

router.get("/convert/old-to-new", addressController.convertOldToNew);

router.get("/convert/new-to-old", addressController.convertNewToOld);

router.get("/suggest", addressController.suggestAddress);

router.get("/search/fuzzy", addressController.fuzzySearch);

module.exports = router;