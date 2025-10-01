// const express = require("express");
// const cors = require("cors");
// require("dotenv").config({ path: "./.env" });

// const pool = require("./config/db"); // Database connection
// const authRoutes = require("./routes/authRoutes");
// const caseRoutes = require("./routes/caseRoutes"); // Import the new case routes
// const chatbotRoutes = require("./routes/chatbotRoutes"); // 👈 1. Import the new chatbot routes


// const app = express();

// // CORS Middleware
// app.use(cors());
// app.use(express.json());

// // Logger middleware — log every request
// app.use((req, res, next) => {
//   console.log(`[${req.method}] ${req.url}`);
//   next();
// });

// // Test route
// app.get("/", (req, res) => {
//   res.send("🚀 LexiVerse Backend is Running!");
// });

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/cases", caseRoutes); // Use the case routes
// app.use("/api/chatbot", chatbotRoutes); // 👈 2. Use the chatbot routes


// // Fallback - 404 Not Found (keep at the bottom)
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// // Start server
// const PORT = process.env.PORT || 5050;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const authRoutes = require("./routes/authRoutes");
const caseRoutes = require("./routes/caseRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const userRoutes = require("./routes/userRoutes"); // 👈 1. Import user routes
const lawyerRoutes = require("./routes/lawyerRoutes"); // 👈 1. Import lawyer routes


const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("🚀 LexiVerse Backend is Running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/users", userRoutes); // 👈 2. Use user routes
app.use("/api/lawyers", lawyerRoutes); // 👈 2. Use lawyer routes
// app.use('/fir_documents', express.static(path.join(__dirname, 'fir_documents')));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});