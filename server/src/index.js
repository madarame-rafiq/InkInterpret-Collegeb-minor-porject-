
import { createServer } from "node:http";
import express from "express";

import { pool } from "./database/pool.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import { sessionMiddleware } from "./config/session.js";
import { createSocketServer } from "./socket/index.js";

const app = express();
const httpServer = createServer(app);

const PORT = 5001;

const allowedOrigins = (
  process.env.CLIENT_ORIGINS ?? "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Initialize Socket.IO with shared session authentication
// and registered socket event handlers.
const io = createSocketServer(httpServer, allowedOrigins);
app.set("io", io);

// Express middleware
app.use(express.json());
app.use(sessionMiddleware);

// HTTP health checks
app.get("/api/health", (req, res) => {
  res.status(200).json({
    health: "Ok",
    message: "The InkInterpret server is healthy!",
  });
});

app.get("/api/health/database", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.status(200).json({
      health: "Ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(503).json({
      health: "unhealthy",
      database: "disconnected",
    });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// Centralized error handler must remain after routes.
app.use(errorHandler);

// Express and Socket.IO share this HTTP server.
httpServer.listen(PORT, () => {
  console.log(`The InkInterpret server is listening on port ${PORT}`);
});
