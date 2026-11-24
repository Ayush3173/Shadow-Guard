import Alert from "../models/Alert.js";

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ detectedAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
      error: error.message,
    });
  }
};

export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch alert",
      error: error.message,
    });
  }
};

export const updateAlertStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "open",
      "investigating",
      "resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid alert status",
      });
    }

   const alert = await Alert.findByIdAndUpdate(
  req.params.id,
  { status },
  {
    returnDocument: "after",
    runValidators: true,
  }
);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    const io = req.app.get("io");

    if (io) {
      io.emit("alertUpdated", alert);
    }

    res.status(200).json({
      success: true,
      message: "Alert status updated successfully",
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update alert status",
      error: error.message,
    });
  }
};