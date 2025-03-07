import express from "express";
import authController from "../controllers/auth.controller";
const router = express.Router();


router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/refresh", authController.refresh);
router.post("/google", authController.loginWithGoogle());

export default router;