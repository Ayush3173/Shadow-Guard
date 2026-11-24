
import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Globe,
  ShieldAlert,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import socket from "../services/socket";
import API from "../services/api";

const API_URL = "http://localhost:5000";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [range, setRange] = useState("all");

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
    const response = await API.get(
  `/analytics?range=${range}`
);

const result = response.data;

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch analytics");
      }

      setAnalytics(result.data);
    } catch (err) {
      console.error("Analytics error:", err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();

  // Connect to ShadowGuard Socket.IO server


  socket.on("connect", () => {
    console.log("📊 Analytics connected:", socket.id);
  });

  // Refresh analytics when a new event arrives
 socket.on("newEvent", fetchAnalytics);
socket.on("newAlert", fetchAnalytics);
return () => {
  socket.off("newEvent", fetchAnalytics);
  socket.off("newAlert", fetchAnalytics);
};
}, [range]);

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-400">
        {error}
      </div>
    );
  }

  const totalEvents =
    analytics?.eventsOverTime?.reduce(
      (total, item) => total + item.count,
      0
    ) || 0;

  const totalAlerts =
    analytics?.alertsBySeverity?.reduce(
      (total, item) => total + item.count,
      0
    ) || 0;

  const attackTypes =
    analytics?.eventsByAttackType?.length || 0;

  return (
    <div className="p-6 text-white space-y-6">

     {/* Header */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold">
      Security Analytics
    </h1>

    <p className="text-gray-400 mt-1">
      Analyze security events, threats and attack patterns.
    </p>
  </div>

  <select
    value={range}
    onChange={(e) => setRange(e.target.value)}
    className="bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500"
  >
    <option value="24h">Last 24 Hours</option>
    <option value="7d">Last 7 Days</option>
    <option value="30d">Last 30 Days</option>
    <option value="all">All Time</option>
  </select>
</div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Total Events */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Activity className="text-blue-400" size={22} />
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Total Events
              </p>

              <h2 className="text-2xl font-bold">
                {totalEvents}
              </h2>
            </div>

          </div>
        </div>

        {/* Total Alerts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="p-3 bg-red-500/10 rounded-lg">
              <ShieldAlert className="text-red-400" size={22} />
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Total Alerts
              </p>

              <h2 className="text-2xl font-bold">
                {totalAlerts}
              </h2>
            </div>

          </div>
        </div>

        {/* Attack Types */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Globe className="text-purple-400" size={22} />
            </div>

            <div>
              <p className="text-gray-400 text-sm">
                Attack Types
              </p>

              <h2 className="text-2xl font-bold">
                {attackTypes}
              </h2>
            </div>

          </div>
        </div>

      </div>

      {/* Events Over Time */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-blue-400" size={20} />

          <h2 className="text-lg font-semibold">
            Security Events Over Time
          </h2>
        </div>

        <div className="w-full h-[320px]">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={analytics?.eventsOverTime || []}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="_id"
                tick={{ fill: "#9ca3af" }}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: "#9ca3af" }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>
      </div>

      {/* Attack + Severity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Attack Type Bar Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-blue-400" size={20} />

            <h2 className="text-lg font-semibold">
              Events by Attack Type
            </h2>
          </div>

          <div className="w-full h-[320px]">

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics?.eventsByAttackType || []}
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="_id"
                  tick={{ fill: "#9ca3af" }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#9ca3af" }}
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* Severity Pie Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="text-red-400" size={20} />

            <h2 className="text-lg font-semibold">
              Alerts by Severity
            </h2>
          </div>

          <div className="w-full h-[320px]">

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={analytics?.alertsBySeverity || []}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {(analytics?.alertsBySeverity || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>

      </div>

      {/* Top Source IPs */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

        <div className="flex items-center gap-2 mb-5">
          <Globe className="text-purple-400" size={20} />

          <h2 className="text-lg font-semibold">
            Top Source IPs
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="py-3">Rank</th>
                <th className="py-3">Source IP</th>
                <th className="py-3">Events</th>
              </tr>
            </thead>

            <tbody>

              {analytics?.topSourceIPs?.length > 0 ? (
                analytics.topSourceIPs.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-800"
                  >
                    <td className="py-3 text-gray-400">
                      #{index + 1}
                    </td>

                    <td className="py-3 font-mono">
                      {item._id || "Unknown"}
                    </td>

                    <td className="py-3">
                      {item.count}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="py-6 text-center text-gray-500"
                  >
                    No source IP data available.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Analytics;