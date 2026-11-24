
import SecurityEvent from "../models/SecurityEvent.js";
import Alert from "../models/Alert.js";

export const getAnalytics = async (req, res) => {
  try {
    // 1. Determine date range
    const { range = "all" } = req.query;

    let startDate = null;
    const now = new Date();

    if (range === "24h") {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (range === "7d") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "30d") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range !== "all") {
      return res.status(400).json({
        success: false,
        message: "Invalid date range. Use 24h, 7d, 30d, or all.",
      });
    }

    // 2. Apply date filter
    const dateFilter = startDate
      ? { createdAt: { $gte: startDate, $lte: now } }
      : {};

    // 3. Events by attack type
    const eventsByAttackType = await SecurityEvent.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 4. Alerts by severity
    const alertsBySeverity = await Alert.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // 5. Top source IPs
    const topSourceIPs = await SecurityEvent.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$sourceIP",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // 6. Events over time
    const eventsOverTime = await SecurityEvent.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        eventsByAttackType,
        alertsBySeverity,
        topSourceIPs,
        eventsOverTime,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};
