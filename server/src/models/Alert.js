import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    alertType: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },

    sourceIP: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "investigating", "resolved"],
      default: "open",
    },

    // 🤖 AI Threat Analysis
    aiAnalysis: {
      attackType: {
        type: String,
        default: null,
      },

      summary: {
        type: String,
        default: null,
      },

      evidence: {
        type: [String],
        default: [],
      },

      potentialImpact: {
        type: String,
        default: null,
      },

      recommendedActions: {
        type: [String],
        default: [],
      },

      confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
    },

    detectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "alerts",
  }
);

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;