const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
const corsOptions = {
  origin: "*", // or specific origin like 'http://localhost:5173'
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json()); // Allow JSON

// Test route
app.get("/", (req, res) => {
  res.send("🚀 LexiVerse Backend is Running!");
});

// Auth routes
app.use("/api/auth", authRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
