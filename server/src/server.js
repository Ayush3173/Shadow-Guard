import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/database.js";

import securityEventRoutes from "./routes/securityEventRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

/*
 * HTTP server
 */
const server = http.createServer(app);

/*
 * Socket.IO server
 */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.set("io", io);

/*
 * Middleware
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

/*
 * Database
 */
connectDB();

/*
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/events", securityEventRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);

/*
 * Socket.IO connection
 */
io.on("connection", (socket) => {
  console.log("🔌 ShadowGuard client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔌 ShadowGuard client disconnected:", socket.id);
  });
});

/*
 * Health check
 */
app.get("/", (req, res) => {
  res.json({
    message: "ShadowGuard API is running",
  });
});

/*
 * Start server
 */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🛡️ ShadowGuard server running on port ${PORT}`);
});