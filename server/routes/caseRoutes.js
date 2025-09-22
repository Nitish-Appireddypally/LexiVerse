// const express = require("express");
// const router = express.Router();
// const pool = require("../config/db");

// // POST /api/cases - API to submit a new case
// router.post("/", async (req, res) => {
//   console.log("🛬 /api/cases POST endpoint hit");
//   const { caseTitle, userInfo, caseDetails, evidenceFiles } = req.body;

//   try {
//     // Insert case into the database
//     const newCase = await pool.query(
//       `INSERT INTO cases (case_title, user_info, case_details, evidence_files, status)
//        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [caseTitle, JSON.stringify(userInfo), JSON.stringify(caseDetails), JSON.stringify(evidenceFiles), 'Submitted']
//     );

//     res.status(201).json(newCase.rows[0]);
//   } catch (error) {
//     console.error("Error submitting case:", error);
//     res.status(500).json({ error: "Failed to submit case" });
//   }
// });

// // GET /api/cases - API to fetch all cases
// router.get("/", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM cases ORDER BY submission_date DESC");
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Error fetching cases:", error);
//     res.status(500).json({ error: "Failed to fetch cases" });
//   }
// });

// // PUT /api/cases/:id - API to update case status
// router.put("/:id", async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body; // New status to update

//   try {
//     const result = await pool.query(
//       `UPDATE cases SET status = $1 WHERE id = $2 RETURNING *`,
//       [status, id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: "Case not found" });
//     }

//     res.status(200).json(result.rows[0]);
//   } catch (error) {
//     console.error("Error updating case status:", error);
//     res.status(500).json({ error: "Failed to update case status" });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/authMiddleware'); // Import our security middleware
const prisma = new PrismaClient();

// POST /api/cases - API to submit a new case
// We apply the 'protect' middleware to ensure only logged-in users can file a case.
router.post("/", protect, async (req, res) => {
  console.log("🛬 /api/cases POST endpoint hit with Prisma");

  // The frontend sends `caseTitle`, but our schema expects `title`. We can alias it.
  const { caseTitle, caseType, caseDetails } = req.body;

  // The user's ID is available from our 'protect' middleware
  const clientId = req.user.id; 

  try {
    const newCase = await prisma.case.create({
      data: {
        title: caseTitle, // Use the aliased variable
        case_type: caseType,
        description: caseDetails.incident, // Map incident details to the description field
        status: 'Submitted', // Set the default status
        
        // Create the link between the case and the user filing it
        participants: {
          create: {
            user_id: clientId,
            role_in_case: 'Petitioner' // The person filing the case is the Petitioner
          }
        }
      }
    });

    res.status(201).json(newCase);
  } catch (error) {
    console.error("Error submitting case with Prisma:", error);
    res.status(500).json({ error: "Failed to submit case" });
  }
});

// GET /api/cases - API to fetch all cases
// For now, let's protect this so only an Admin can see all cases.
router.get("/", protect, async (req, res) => {
  try {
    // A simple authorization check
    if (req.user.role !== 'Admin') {
      // If not an admin, we could return just their cases in the future.
      // For now, let's deny access.
      return res.status(403).json({ error: "Access denied. Admin role required." });
    }

    const allCases = await prisma.case.findMany({
      orderBy: {
        created_at: 'desc'
      },
      // Include participant info in the response
      include: {
        participants: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });
    res.status(200).json(allCases);
  } catch (error) {
    console.error("Error fetching cases with Prisma:", error);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

// PUT /api/cases/:id - API to update case status
router.put("/:id", protect, async (req, res) => {
  // Only an Admin should be able to update a case status
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: "Access denied. Admin role required." });
  }

  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedCase = await prisma.case.update({
      where: { id: parseInt(id) },
      data: { status: status },
    });
    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating case status with Prisma:", error);
    res.status(500).json({ error: "Failed to update case status" });
  }
});

module.exports = router;