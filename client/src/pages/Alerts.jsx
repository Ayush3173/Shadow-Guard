import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Search,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

import socket from "../services/socket";
import API from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/alerts");

      setAlerts(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  // Realtime alerts
  useEffect(() => {
    const handleNewAlert = (newAlert) => {
      console.log("🚨 New alert:", newAlert);

      setAlerts((currentAlerts) => [
        newAlert,
        ...currentAlerts,
      ]);
    };

    const handleAlertUpdated = (updatedAlert) => {
      console.log("🔄 Alert updated:", updatedAlert);

      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alert._id === updatedAlert._id
            ? updatedAlert
            : alert
        )
      );
    };

    socket.on("newAlert", handleNewAlert);
    socket.on("alertUpdated", handleAlertUpdated);

    return () => {
      socket.off("newAlert", handleNewAlert);
      socket.off("alertUpdated", handleAlertUpdated);
    };
  }, []);

  const filteredAlerts = alerts.filter((alert) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      alert.alertType?.toLowerCase().includes(searchText) ||
      alert.title?.toLowerCase().includes(searchText) ||
      alert.description?.toLowerCase().includes(searchText) ||
      alert.sourceIP?.toLowerCase().includes(searchText);

    const matchesSeverity =
      severity === "all" ||
      alert.severity?.toLowerCase() === severity;

    return matchesSearch && matchesSeverity;
  });

  return (
    <main className="p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Security Alerts
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Monitor and investigate detected security threats.
          </p>
        </div>

        <button
          onClick={loadAlerts}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />
        </div>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 outline-none"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        {loading ? (
          <div className="p-10 text-center text-slate-400">
            Loading alerts...
          </div>
        ) : error ? (
          <div className="p-10 text-center text-red-400">
            {error}
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-10 text-center">
            <AlertTriangle
              size={32}
              className="mx-auto text-slate-600"
            />

            <p className="mt-3 text-slate-400">
              No alerts found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredAlerts.map((alert) => (
              <AlertRow
                key={alert._id}
                alert={alert}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function AlertRow({ alert }) {
  return (
    <Link
      to={`/alerts/${alert._id}`}
      className="block transition hover:bg-slate-800/40"
    >
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-lg bg-red-500/10 p-2 text-red-400">
            <AlertTriangle size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="font-medium text-white">
              {alert.alertType || alert.title || "Security Alert"}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {alert.description || "No description available."}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                IP: {alert.sourceIP || "Unknown"}
              </span>

              <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                Risk: {alert.riskScore ?? "N/A"}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              {alert.createdAt
                ? new Date(alert.createdAt).toLocaleString()
                : "Unknown time"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SeverityBadge severity={alert.severity} />

          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
            {alert.status || "open"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function SeverityBadge({ severity }) {
  const value = severity?.toLowerCase() || "low";

  const styles = {
    critical: "bg-red-500/10 text-red-400",
    high: "bg-orange-500/10 text-orange-400",
    medium: "bg-yellow-500/10 text-yellow-400",
    low: "bg-blue-500/10 text-blue-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[value] || styles.low
      }`}
    >
      {severity || "Low"}
    </span>
  );
}