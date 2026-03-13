const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

/**
 * GET /api/v1/address/convert/old-to-new
*/

router.get("/convert/old-to-new", addressController.convertOldToNew);


module.exports = router;