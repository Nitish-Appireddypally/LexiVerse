const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// CORS Middleware
app.use(cors());
app.use(express.json());

// Logger middleware — log every request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Test route
app.get("/", (req, res) => {
  res.send("🚀 LexiVerse Backend is Running!");
});

// Auth routes
app.use("/api/auth", authRoutes);

// Fallback - 404 Not Found (keep at the bottom)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
