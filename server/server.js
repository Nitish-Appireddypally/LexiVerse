// const express = require("express");
// const cors = require("cors");
// require("dotenv").config({ path: "./.env" });

// const pool = require("./config/db");
// const authRoutes = require("./routes/authRoutes");

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

// // Auth routes
// app.use("/api/auth", authRoutes);

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
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const pool = require("./config/db"); // Database connection
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

// Case routes

// API to submit a new case
app.post("/api/cases", async (req, res) => {
  console.log("🛬 /api/cases POST endpoint hit");
  const { caseTitle, userInfo, caseDetails, evidenceFiles } = req.body;

  try {
    // Insert case into the database
    const newCase = await pool.query(
      `INSERT INTO cases (case_title, user_info, case_details, evidence_files, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [caseTitle, JSON.stringify(userInfo), JSON.stringify(caseDetails), JSON.stringify(evidenceFiles), 'Submitted']
    );

    res.status(201).json(newCase.rows[0]);
  } catch (error) {
    console.error("Error submitting case:", error);
    res.status(500).json({ error: "Failed to submit case" });
  }
});

// API to fetch all cases (for admin to review)
app.get("/api/cases", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cases ORDER BY submission_date DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

// API to update case status (e.g., change to "In Review" or "Resolved")
app.put("/api/cases/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // New status to update

  try {
    const result = await pool.query(
      `UPDATE cases SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating case status:", error);
    res.status(500).json({ error: "Failed to update case status" });
  }
});

// Fallback - 404 Not Found (keep at the bottom)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
