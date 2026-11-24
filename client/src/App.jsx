
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Events from "./pages/Events";
import AlertDetails from "./pages/AlertDetails";
import Analytics from "./pages/Analytics";

import ProtectedRoute from "./components/ProtectedRoute";
import { Settings } from "lucide-react";

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/events" element={<Events />} />
            <Route path="/alerts/:id" element={<AlertDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
