const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// POST /api/cases - API to submit a new case
router.post("/", async (req, res) => {
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

// GET /api/cases - API to fetch all cases
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cases ORDER BY submission_date DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

// PUT /api/cases/:id - API to update case status
router.put("/:id", async (req, res) => {
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

module.exports = router;