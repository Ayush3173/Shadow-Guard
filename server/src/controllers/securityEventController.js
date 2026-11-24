import SecurityEvent from "../models/SecurityEvent.js";
import { analyzeSecurityEvent } from "../services/threatDetectionService.js";

export const createSecurityEvent = async (req, res) => {
  try {
    const event = await SecurityEvent.create(req.body);

    // Analyze the event for threats
    const alerts = await analyzeSecurityEvent(event);

    // Get Socket.IO instance
    const io = req.app.get("io");

    // Send the newly created event to connected clients
    if (io) {
      io.emit("newEvent", event);
    }

    // Send newly generated alerts to connected clients
    if (io && alerts?.length) {
      alerts.forEach((alert) => {
        io.emit("newAlert", alert);
      });
    }

    res.status(201).json({
      success: true,
      message: "Security event created successfully",
      data: event,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create security event",
      error: error.message,
    });
  }
};

export const getSecurityEvents = async (req, res) => {
  try {
    const events = await SecurityEvent.find()
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch security events",
      error: error.message,
    });
  }
};