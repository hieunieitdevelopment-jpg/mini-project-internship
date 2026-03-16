const express = require("express");
const router = express.Router();
const convertController = require("../controllers/convertController");
const dropdownController = require("../controllers/dropdownController");


// ============== CONVERT ==============

// GET /api/v1/address/convert/old-to-new
router.get("/convert/old-to-new", convertController.convertOldToNew);

// GET /api/v1/address/convert/new-to-old
router.get("/convert/new-to-old", convertController.convertNewToOld);

// ============== DROPDOWN ==============

// GET /api/v1/address/provinces
router.get("/provinces", dropdownController.getProvinces);

// GET /api/v1/address/districts?provinceId=X
router.get("/districts", dropdownController.getDistricts);

// GET /api/v1/address/wards?districtId=X
router.get("/wards", dropdownController.getWards);


module.exports = router;