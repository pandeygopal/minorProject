import express from "express";
import { login, register, logout, getUser, sendOtp, verifyOtp, aiVoiceSetup } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/ai-voice-setup", aiVoiceSetup);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);

export default router;
