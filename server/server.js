const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const pool = require("./config/db"); // Database connection
const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes"); // Import the new case routes
const chatbotRoutes = require("./routes/chatbotRoutes"); // 👈 1. Import the new chatbot routes


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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes); // Use the case routes
app.use("/api/chatbot", chatbotRoutes); // 👈 2. Use the chatbot routes


// Fallback - 404 Not Found (keep at the bottom)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});