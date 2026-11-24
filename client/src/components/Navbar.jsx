
import { Bell, CircleUserRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConnectionStatus from "./ConnectionStatus";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("shadowguard_user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("shadowguard_token");
    localStorage.removeItem("shadowguard_user");

    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Security Dashboard
        </h2>

        <p className="text-xs text-slate-500">
          Monitor your security environment
        </p>
      </div>

      <div className="flex items-center gap-5">
        <ConnectionStatus />

        <Bell
          size={20}
          className="cursor-pointer text-slate-400 hover:text-white"
        />

        <div className="flex items-center gap-2">
          <CircleUserRound size={24} className="text-slate-400" />

          <div className="hidden sm:block">
            <p className="text-sm text-white">
              {user?.name || "Analyst"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.role || "analyst"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-red-400"
        >
          <LogOut size={17} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
