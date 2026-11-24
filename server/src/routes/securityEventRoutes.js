
import express from "express";

import {
  createSecurityEvent,
  getSecurityEvents,
} from "../controllers/securityEventController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public ingestion endpoint for incoming security logs
router.post("/", createSecurityEvent);

// Only authenticated users can view security events
router.get("/", protect, getSecurityEvents);

export default router;
