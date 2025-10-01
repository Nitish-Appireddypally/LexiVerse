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
const { authorize } = require('../middleware/authMiddleware'); 
const { generateFirPdf } = require('../controllers/firController');

const prisma = new PrismaClient();

// --- CONTROLLER LOGIC ---

// POST /api/cases - Create a new case
const createCase = async (req, res) => {
  const { complainantDetails, offenseDetails, accusedPersons, witnesses, caseNarrative } = req.body;
  const clientId = req.user.id; 

  try {
    const newCase = await prisma.case.create({
      data: {
        title: caseNarrative.title,
        case_type: caseNarrative.caseType,
        description: caseNarrative.incidentDetails,
        status: 'Submitted',
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
};

// GET /api/cases - Fetch ALL cases (for Admins)
const getAllCases = async (req, res) => {
  try {
    const allCases = await prisma.case.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        participants: {
          include: { user: { select: { name: true, email: true } } }
        }
      }
    });
    res.status(200).json(allCases);
  } catch (error) {
    console.error("Error fetching all cases:", error);
    res.status(500).json({ error: "Failed to fetch all cases" });
  }
};

// GET /api/cases/my-cases - Fetch cases for the logged-in user
const getMyCases = async (req, res) => {
  const userId = req.user.id;
  try {
    const userCases = await prisma.case.findMany({
      where: {
        participants: { some: { user_id: userId } }
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
};

// GET /api/cases/:id - Get a single case by its ID
const getCaseById = async (req, res) => {
  const caseId = parseInt(req.params.id);
  const user = req.user;

  try {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true } } }
        },
        fir: true,
      }
    });

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found.' });
    }

    const isParticipant = caseData.participants.some(p => p.user_id === user.id);
    if (user.role !== 'Admin' && !isParticipant) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this case.' });
    }

    res.status(200).json(caseData);
  } catch (error) {
    console.error("Error fetching single case:", error);
    res.status(500).json({ message: "Server error while fetching case." });
  }
};

// PUT /api/cases/:id - Update case status (for Admins)
const updateCaseStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedCase = await prisma.case.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating case status:", error);
    res.status(500).json({ error: "Failed to update case status" });
  }
};

// --- NEW FUNCTION: Update investigation details for a case ---
const updateInvestigationDetails = async (req, res) => {
  const caseId = parseInt(req.params.id);
  const user = req.user;
  const { fir_number, police_station, investigating_officer, io_contact, status } = req.body;

  try {
    const caseAccess = await prisma.case.findFirst({
      where: { 
        id: caseId,
        participants: { some: { user_id: user.id } }
      }
    });

    if (user.role !== 'Admin' && !caseAccess) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to update this case.' });
    }

    const [, updatedCase] = await prisma.$transaction([
      prisma.fIR.upsert({
        where: { case_id: caseId },
        update: { fir_number, police_station, investigating_officer, io_contact },
        create: { case_id: caseId, fir_number, police_station, investigating_officer, io_contact }
      }),
      prisma.case.update({
        where: { id: caseId },
        data: { status }
      })
    ]);

    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating investigation details:", error);
    res.status(500).json({ message: 'Server error while updating details.' });
  }
};

// --- ROUTE DEFINITIONS ---

router.post("/", authorize(['Client', 'Lawyer', 'Admin']), createCase);
router.get("/", authorize(['Admin']), getAllCases);
router.get("/my-cases", authorize(['Client', 'Lawyer', 'Admin']), getMyCases);
router.get("/:id", authorize(['Client', 'Lawyer', 'Admin']), getCaseById);
router.put("/:id", authorize(['Admin']), updateCaseStatus); // Note: This is for general status updates by an Admin
router.post("/:id/generate-fir", authorize(['Client', 'Lawyer', 'Admin']), generateFirPdf);

// --- NEW ROUTE for updating all investigation details ---
router.put('/:id/investigation', authorize(['Client', 'Lawyer', 'Admin']), updateInvestigationDetails);


module.exports = router;