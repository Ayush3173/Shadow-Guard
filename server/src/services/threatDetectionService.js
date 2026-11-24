import SecurityEvent from "../models/SecurityEvent.js";
import Alert from "../models/Alert.js";
import { analyzeThreatWithAI } from "./aiThreatAnalysisService.js";

const createAlertIfNotExists = async ({
  alertType,
  severity,
  sourceIP,
  description,
  riskScore,
}) => {
  const existingAlert = await Alert.findOne({
    alertType,
    sourceIP,
    status: {
      $in: ["open", "investigating"],
    },
  });

  if (existingAlert) {
    return existingAlert;
  }

  return await Alert.create({
    alertType,
    severity,
    sourceIP,
    description,
    riskScore,
  });
};

// Rule 1: Brute Force Detection
export const detectBruteForce = async (sourceIP) => {
  const fiveMinutesAgo = new Date(
    Date.now() - 5 * 60 * 1000
  );

  const failedAttempts = await SecurityEvent.countDocuments({
    sourceIP,
    eventType: "failed_login",
    timestamp: {
      $gte: fiveMinutesAgo,
    },
  });

  if (failedAttempts >= 5) {
    return createAlertIfNotExists({
      alertType: "brute_force",
      severity: "high",
      sourceIP,
      description:
        "Multiple failed login attempts detected from the same IP within a short period.",
      riskScore: 85,
    });
  }

  return null;
};

// Rule 2: SQL Injection Detection
export const detectSQLInjection = async (event) => {
  const suspiciousPatterns = [
    "select *",
    "union select",
    "drop table",
    "or 1=1",
    "' or '1'='1",
    "insert into",
    "delete from",
  ];

  const message = event.message.toLowerCase();

  const detectedPattern = suspiciousPatterns.find(
    (pattern) => message.includes(pattern)
  );

  if (detectedPattern) {
    return createAlertIfNotExists({
      alertType: "sql_injection",
      severity: "critical",
      sourceIP: event.sourceIP,
      description:
        "A security event contains a pattern associated with a possible SQL injection attempt.",
      riskScore: 95,
    });
  }

  return null;
};

// Rule 3: Port Scan Detection
export const detectPortScan = async (sourceIP) => {
  const fiveMinutesAgo = new Date(
    Date.now() - 5 * 60 * 1000
  );

  const portScanEvents = await SecurityEvent.countDocuments({
    sourceIP,
    eventType: "port_scan",
    timestamp: {
      $gte: fiveMinutesAgo,
    },
  });

  if (portScanEvents >= 10) {
    return createAlertIfNotExists({
      alertType: "port_scan",
      severity: "high",
      sourceIP,
      description:
        "Multiple port scan events detected from the same source IP within a short period.",
      riskScore: 80,
    });
  }

  return null;
};

// Central Detection Engine
export const analyzeSecurityEvent = async (event) => {
  const alerts = [];

  if (event.eventType === "failed_login") {
    const alert = await detectBruteForce(event.sourceIP);

    if (alert) {
      alerts.push(alert);
    }
  }

  if (event.eventType === "sql_request") {
    const alert = await detectSQLInjection(event);

    if (alert) {
      alerts.push(alert);
    }
  }

  if (event.eventType === "port_scan") {
    const alert = await detectPortScan(event.sourceIP);

    if (alert) {
      alerts.push(alert);
    }
  }

  // Run AI analysis for every newly generated alert
  for (const alert of alerts) {
    const aiResult = await analyzeThreatWithAI({
      event,
      alert,
    });

    alert.aiAnalysis = aiResult.analysis || null;

    await alert.save();
  }

  return alerts;
};