import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Users,
  Settings,
  Shield,
  ChartColumn,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Alerts",
    icon: ShieldAlert,
    path: "/alerts",
  },
  {
    name: "Events",
    icon: Activity,
    path: "/events",
  },
    {
  name: "Analytics",
  icon: ChartColumn,
  path: "/analytics",
},
  {
    name: "Users",
    icon: Users,
    path: "/users",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },

];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-slate-800 bg-slate-950 p-5">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
          <Shield size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-white">
            ShadowGuard
          </h1>

          <p className="text-xs text-slate-500">
            Security Operations
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}