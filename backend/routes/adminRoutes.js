import express from "express";
import { getPlatformStats, getAllUsers } from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/stats", isAuthenticated, isAdmin, getPlatformStats);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);

export default router;
