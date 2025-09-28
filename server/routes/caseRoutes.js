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
// --- CHANGE #1: We now import 'authorize' instead of 'protect' ---
const { authorize } = require('../middleware/authMiddleware'); 
const prisma = new PrismaClient();

// POST /api/cases - API to submit a new case
// Any authenticated user ('Client', 'Lawyer', 'Admin') can file a case.
router.post("/", authorize(['Client', 'Lawyer', 'Admin']), async (req, res) => {
  const { complainantDetails, offenseDetails, accusedPersons, witnesses, caseNarrative } = req.body;
  const clientId = req.user.id; 

  try {
    const newCase = await prisma.case.create({
      data: {
        title: caseNarrative.title,
        case_type: caseNarrative.caseType,
        description: caseNarrative.incidentDetails,
        status: 'Submitted',
        // Store all the rich, structured data in our new JSON field
        full_details: {
          complainant: complainantDetails,
          offense: offenseDetails,
          accused: accusedPersons,
          witnesses: witnesses
        },
        participants: {
          create: {
            user_id: clientId,
            role_in_case: 'Petitioner'
          }
        }
      }
    });
    res.status(201).json(newCase);
  } catch (error) {
    console.error("Error submitting case:", error);
    res.status(500).json({ error: "Failed to submit case" });
  }
});

// GET /api/cases - API to fetch all cases
// --- CHANGE #2: We now specify that ONLY 'Admin' role can access this route ---
router.get("/", authorize(['Admin']), async (req, res) => {
  try {
    // --- CHANGE #3: The old "if (req.user.role !== 'Admin')" check is NO LONGER NEEDED here ---
    // The middleware handles the security check for us.

    const allCases = await prisma.case.findMany({
      orderBy: {
        created_at: 'desc'
      },
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

// --- NEW FEATURE: A route for users to get only their own cases ---
router.get("/my-cases", authorize(['Client', 'Lawyer', 'Admin']), async (req, res) => {
  const userId = req.user.id;
  try {
    const userCases = await prisma.case.findMany({
      where: {
        participants: {
          some: { user_id: userId } // Prisma query to find cases where the user is a participant
        }
      },
      orderBy: { created_at: 'desc' },
      include: {
        participants: { include: { user: { select: { name: true } } } }
      }
    });
    res.status(200).json(userCases);
  } catch (error) {
     console.error("Error fetching user's cases:", error);
     res.status(500).json({ error: "Failed to fetch your cases" });
  }
});


// PUT /api/cases/:id - API to update case status
// --- CHANGE #4: We now specify that ONLY 'Admin' role can access this route ---
router.put("/:id", authorize(['Admin']), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // --- CHANGE #5: The old "if (req.user.role !== 'Admin')" check is also removed from here ---
    
    const updatedCase = await prisma.case.update({
      where: { id: parseInt(id) },
      data: { status }, // Note: Prisma expects the ENUM format, e.g., 'In_Court'
    });
    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating case status with Prisma:", error);
    res.status(500).json({ error: "Failed to update case status" });
  }
});

module.exports = router;