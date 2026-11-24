import { useEffect, useState } from "react";
import {
  Activity,
  ShieldAlert,
  AlertTriangle,
  CircleAlert,
} from "lucide-react";

import StatCard from "../components/StatCard";
import { getDashboardStats } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();

        setStats(data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-slate-400">
          Loading security data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Security Overview
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Real-time overview of your security environment
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          description="Security events recorded"
          icon={Activity}
        />

        <StatCard
          title="Total Alerts"
          value={stats.totalAlerts}
          description="Detected security alerts"
          icon={ShieldAlert}
        />

        <StatCard
          title="Open Alerts"
          value={stats.openAlerts}
          description="Alerts requiring attention"
          icon={AlertTriangle}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3">
            <CircleAlert className="text-red-400" />

            <h2 className="font-semibold text-white">
              Alerts by Severity
            </h2>
          </div>

          <div className="mt-6 space-y-4">
           <Severity
  name="Critical"
  value={stats.alertsBySeverity?.critical ?? 0}
/>

<Severity
  name="High"
  value={stats.alertsBySeverity?.high ?? 0}
/>

<Severity
  name="Medium"
  value={stats.alertsBySeverity?.medium ?? 0}
/>

<Severity
  name="Low"
  value={stats.alertsBySeverity?.low ?? 0}
/>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">
            System Status
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-400" />

            <div>
              <p className="font-medium text-white">
                ShadowGuard is operational
              </p>

              <p className="text-sm text-slate-500">
                Backend services are responding normally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Severity({ name, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">
        {name}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>
    </div>
  );
}