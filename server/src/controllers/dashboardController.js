import SecurityEvent from "../models/SecurityEvent.js";
import Alert from "../models/Alert.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalEvents,
      totalAlerts,
      openAlerts,
      criticalAlerts,
      highAlerts,
      mediumAlerts,
      lowAlerts,
    ] = await Promise.all([
      SecurityEvent.countDocuments(),
      Alert.countDocuments(),
      Alert.countDocuments({ status: "open" }),
      Alert.countDocuments({ severity: "critical" }),
      Alert.countDocuments({ severity: "high" }),
      Alert.countDocuments({ severity: "medium" }),
      Alert.countDocuments({ severity: "low" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        totalAlerts,
        openAlerts,
        alertsBySeverity: {
          critical: criticalAlerts,
          high: highAlerts,
          medium: mediumAlerts,
          low: lowAlerts,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};