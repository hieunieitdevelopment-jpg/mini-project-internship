const express = require("express");
const router = express.Router();


const provinceRoutes = require("./provinceRoutes");
const districtRoutes = require("./districtRoutes");
const unitRoutes = require("./unitRoutes");
const mappingRoutes = require("./mappingRoutes");
const authRoutes = require("./authRoutes");

router.use("/auth", authRoutes);
router.use("/provinces", provinceRoutes);
router.use("/districts", districtRoutes);
router.use("/units",unitRoutes);
router.use("/mappings", mappingRoutes);


module.exports = router;
