
import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

// Get all users (Admin only)
router.get("/", protect, adminOnly, getUsers);

export default router;
