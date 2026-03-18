const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../middlewares/validate");

// POST /api/v1/auth/register
router.post("/register", validateRegister, authController.register);

// POST /api/v1/auth/login
router.post("/login", validateLogin, authController.login);

module.exports = router;
