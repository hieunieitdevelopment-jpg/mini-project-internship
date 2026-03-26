const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, requireAdmin } =  require("../middlewares/auth.middleware");
const { validateRegister, validateLogin, validateChangePassword, validateResetRequest, validateResetPassword} = require("../middlewares/validate");
const passport = require("passport");

router.post("/register", validateRegister, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/change-password", verifyToken, validateChangePassword, authController.changePassword);
router.post("/request-password-reset", validateResetRequest, authController.requestPasswordReset);
router.post("/reset-password", validateResetPassword, authController.resetPassword);
router.get("/users", verifyToken, requireAdmin, authController.getAllUsers);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/v1/auth/google" }),
    authController.googleCallback
);

module.exports = router;