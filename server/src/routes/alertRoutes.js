import express from "express";

import {
  getAlerts,
  getAlertById,
  updateAlertStatus,
} from "../controllers/alertController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect,getAlerts);

router.get("/:id",protect, getAlertById);

router.patch("/:id/status",protect, updateAlertStatus);

export default router;