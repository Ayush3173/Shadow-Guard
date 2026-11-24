import mongoose from "mongoose";

const securityEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
    },

    sourceIP: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      default: null,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    message: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const SecurityEvent = mongoose.model(
  "SecurityEvent",
  securityEventSchema
);

export default SecurityEvent;