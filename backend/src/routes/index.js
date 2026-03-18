const express = require("express");
const router = express.Router();

const provinceRoutes = require("./provinceRoutes");
const districtRoutes = require("./districtRoutes");
const unitRoutes = require("./unitRoutes");
const mappingRoutes = require("./mappingRoutes");
const uploadRoutes = require("./uploadRoutes")

router.use("/provinces", provinceRoutes);
router.use("/districts", districtRoutes);
router.use("/units", unitRoutes);
router.use("/mappings", mappingRoutes);
router.use("/api/v1", uploadRoutes)

module.exports = router;
