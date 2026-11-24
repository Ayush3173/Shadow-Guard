import { useEffect, useState } from "react";
import {
  Activity,
  Search,
  RefreshCw,
} from "lucide-react";

import API from "../services/api";
import socket from "../services/socket";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);

      const response = await API.get("/events");

      setEvents(response.data.data || []);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
const handleNewEvent = (newEvent) => {
  setEvents((currentEvents) => {
    const alreadyExists = currentEvents.some(
      (event) => event._id === newEvent._id
    );

    if (alreadyExists) return currentEvents;

    return [newEvent, ...currentEvents];
  });
};

  socket.on("newEvent", handleNewEvent);

  return () => {
    socket.off("newEvent", handleNewEvent);
  };
}, []);


  const filteredEvents = events.filter((event) =>
    JSON.stringify(event)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Security Events
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Monitor security activity collected by ShadowGuard.
          </p>
        </div>

        <button
          onClick={loadEvents}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* Search */}
      <div className="mb-5 relative">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          type="text"
          placeholder="Search security events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-800 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
        />

      </div>

      {/* Events */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

        {loading ? (
          <div className="p-10 text-center text-slate-400">
            Loading security events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-10 text-center">

            <Activity
              size={32}
              className="mx-auto text-slate-600"
            />

            <p className="mt-3 text-slate-400">
              No security events found.
            </p>

          </div>
        ) : (
          <div className="divide-y divide-slate-800">

            {filteredEvents.map((event) => (
              <EventRow
                key={event._id}
                event={event}
              />
            ))}

          </div>
        )}

      </div>

    </main>
  );
}

function EventRow({ event }) {
  return (
    <div className="p-5 transition hover:bg-slate-800/40">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* Event information */}
        <div className="flex items-start gap-4">

          <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
            <Activity size={20} />
          </div>

          <div className="min-w-0">

            <h3 className="font-medium text-white">
              {event.eventType || "Security Event"}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {event.message || "Security event detected by ShadowGuard."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              {/* Source IP */}
              <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                IP: {event.sourceIP || "Unknown"}
              </span>

              {/* Severity */}
              {event.severity && (
                <span className="rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-400">
                  {event.severity}
                </span>
              )}

            </div>

          </div>

        </div>

        {/* Time */}
        <div className="shrink-0 text-left md:text-right">

          <p className="text-xs text-slate-500">
            Source
          </p>

          <p className="mt-1 text-xs text-slate-300">
            {event.sourceIP || "Unknown IP"}
          </p>

          <p className="mt-2 text-xs text-slate-600">
            {event.timestamp
              ? new Date(event.timestamp).toLocaleString()
              : event.createdAt
              ? new Date(event.createdAt).toLocaleString()
              : "Unknown time"}
          </p>

        </div>

      </div>

    </div>
  );
}
