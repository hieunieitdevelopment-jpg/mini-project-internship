const express = require("express");
const router = express.Router();

const addressController = require("../controllers/addressController");

router.get("/convert/new-to-old", addressController.convertNewToOld);

router.get("/search/fuzzy", addressController.fuzzySearch);

module.exports = router;