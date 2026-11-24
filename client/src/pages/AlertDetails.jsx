import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldAlert,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  Globe,
  Target,
} from "lucide-react";

import API from "../services/api";

export default function AlertDetails() {
  const { id } = useParams();

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const loadAlert = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/alerts/${id}`);

        setAlert(response.data.data);
      } catch (error) {
        console.error("Failed to load alert:", error);
        setError("Failed to load alert details.");
      } finally {
        setLoading(false);
      }
    };

    loadAlert();
  }, [id]);


  const updateStatus = async (newStatus) => {
  try {
    setUpdatingStatus(true);
    setStatusError("");

    const response = await API.patch(
      `/alerts/${id}/status`,
      { status: newStatus }
    );

    setAlert(response.data.data);
  } catch (error) {
    console.error("Failed to update alert status:", error);

    setStatusError(
      error.response?.data?.message ||
      "Failed to update alert status. Please try again."
    );
  } finally {
    setUpdatingStatus(false);
  }
};
  if (loading) {

    
    return (
      <main className="p-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
          Loading alert investigation...
        </div>
      </main>
    );
  }

  if (error || !alert) {
    return (
      <main className="p-6">
        <Link
          to="/alerts"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Alerts
        </Link>

        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400">
          {error || "Alert not found."}
        </div>
      </main>
    );
  }

  const ai = alert.aiAnalysis;

  return (
    <main className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/alerts"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Alerts
        </Link>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-3 text-red-400">
                <ShieldAlert size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  Alert Investigation
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Investigate the security incident and AI analysis.
                </p>
              </div>
            </div>
          </div>
<div className="flex flex-wrap items-center gap-2">
  <span
    className={`rounded-full px-3 py-1 text-xs font-medium uppercase ${
      alert.status === "open"
        ? "bg-red-500/10 text-red-400"
        : alert.status === "investigating"
        ? "bg-yellow-500/10 text-yellow-400"
        : "bg-green-500/10 text-green-400"
    }`}
  >
    {alert.status}
  </span>

  {alert.status !== "investigating" && (
    <button
      onClick={() => updateStatus("investigating")}
      disabled={updatingStatus}
      className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-medium text-yellow-400 transition hover:bg-yellow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Investigate
    </button>
  )}

  {alert.status !== "resolved" && (
    <button
      onClick={() => updateStatus("resolved")}
      disabled={updatingStatus}
      className="rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-400 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Resolve
    </button>
  )}

  {alert.status !== "open" && (
    <button
      onClick={() => updateStatus("open")}
      disabled={updatingStatus}
      className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Reopen
    </button>
  )}
</div>
{statusError && (
  <p className="mt-2 text-sm text-red-400">
    {statusError}
  </p>
)}
        </div>
      </div>

      {/* Alert Overview */}
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<Target size={18} />}
          label="Attack Type"
          value={alert.alertType}
        />

        <InfoCard
          icon={<AlertTriangle size={18} />}
          label="Severity"
          value={alert.severity}
          valueClass="uppercase text-red-400"
        />

        <InfoCard
          icon={<ShieldAlert size={18} />}
          label="Risk Score"
          value={`${alert.riskScore} / 100`}
        />

        <InfoCard
          icon={<Globe size={18} />}
          label="Source IP"
          value={alert.sourceIP}
        />
      </section>

      {/* Description */}
      <section className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-3 text-lg font-semibold text-white">
          Alert Description
        </h2>

        <p className="text-sm leading-6 text-slate-400">
          {alert.description}
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
          <Clock size={14} />

          {alert.detectedAt
            ? new Date(alert.detectedAt).toLocaleString()
            : "Unknown time"}
        </div>
      </section>

      {/* AI Analysis */}
      <section className="rounded-xl border border-blue-500/20 bg-slate-900 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/10 p-3 text-blue-400">
            <Brain size={24} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              AI Threat Analysis
            </h2>

            <p className="text-sm text-slate-400">
              Gemini-powered security investigation
            </p>
          </div>
        </div>

        {!ai ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 text-center">
            <Brain
              size={28}
              className="mx-auto text-slate-600"
            />

            <p className="mt-3 text-sm text-slate-400">
              AI analysis is not available for this alert.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Attack Type + Confidence */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Attack Type
                </p>

                <p className="mt-2 text-lg font-semibold text-white">
                  {ai.attackType || "Unknown"}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  AI Confidence
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${ai.confidence || 0}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm font-semibold text-blue-400">
                    {ai.confidence || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="mb-2 font-medium text-white">
                Summary
              </h3>

              <p className="text-sm leading-6 text-slate-400">
                {ai.summary || "No summary available."}
              </p>
            </div>

            {/* Evidence */}
            <div>
              <h3 className="mb-3 font-medium text-white">
                Evidence
              </h3>

              <div className="space-y-2">
                {(ai.evidence || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3"
                  >
                    <CheckCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-blue-400"
                    />

                    <span className="text-sm text-slate-400">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential Impact */}
            <div>
              <h3 className="mb-2 font-medium text-white">
                Potential Impact
              </h3>

              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  {ai.potentialImpact ||
                    "No potential impact information available."}
                </p>
              </div>
            </div>

            {/* Recommended Actions */}
            <div>
              <h3 className="mb-3 font-medium text-white">
                Recommended Actions
              </h3>

              <div className="space-y-2">
                {(ai.recommendedActions || []).map(
                  (action, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-950 p-4"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-400">
                        {index + 1}
                      </span>

                      <span className="text-sm leading-6 text-slate-400">
                        {action}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
  valueClass = "text-white",
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className={`mt-3 text-lg font-semibold ${valueClass}`}>
        {value || "Unknown"}
      </p>
    </div>
  );
}