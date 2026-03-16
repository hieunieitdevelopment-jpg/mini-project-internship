const express = require("express");
const router = express.Router();
const convertController = require("../controllers/convertController");
const suggestController = require("../controllers/suggestController");
const fuzzyController = require("../controllers/fuzzyController");
const dropdownController = require("../controllers/dropdownController");


/*
* CONVERT
*/

// GET /api/v1/address/convert/old-to-new
router.get("/convert/old-to-new", convertController.convertOldToNew);

// GET /api/v1/address/convert/new-to-old
router.get("/convert/new-to-old", convertController.convertNewToOld);


/* 
* SUGGEST
*/

// GET /api/v1/address/suggest?q=keyword&level=ward
router.get("/suggest", suggestController.suggestUnits);


/*
* FUZZY SEARCH
*/

// GET /api/v1/address/fuzzy-search?q=keyword&level=ward
router.get("/fuzzy-search", fuzzyController.fuzzySearch);

/*
* DROPDOWN
*/

// GET /api/v1/address/dropdown/provinces
router.get("/dropdown/provinces", dropdownController.getProvinces);

// GET /api/v1/address/dropdown/districts?provinceId=1
router.get("/dropdown/districts", dropdownController.getDistricts);

// GET /api/v1/address/dropdown/wards?districtId=2
router.get("/dropdown/wards", dropdownController.getWards);


module.exports = router;