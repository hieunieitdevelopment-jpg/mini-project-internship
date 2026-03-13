const express = require("express");
const router = express.Router();

const addressRoutes = require("./address.routes");

router.use("/address", addressRoutes);

module.exports = router;