const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');

// Import all controller functions
const { 
  createCase, 
  getAllCases, 
  getMyCases, 
  updateCaseStatus 
} = require('../controllers/caseListController');

const { 
  getCaseById, 
  requestLawyerForCase 
} = require('../controllers/caseController');

const { 
  generateFirPdf, 
  updateInvestigationDetails 
} = require('../controllers/firController');


// --- ROUTE DEFINITIONS ---

router.post("/", authorize(['Client', 'Lawyer', 'Admin']), createCase);
router.get("/", authorize(['Admin']), getAllCases);
router.get("/my-cases", authorize(['Client', 'Lawyer', 'Admin']), getMyCases);
router.get("/:id", authorize(['Client', 'Lawyer', 'Admin']), getCaseById);
router.put("/:id", authorize(['Admin']), updateCaseStatus);
router.post("/:id/generate-fir", authorize(['Client', 'Lawyer', 'Admin']), generateFirPdf);
router.put('/:id/investigation', authorize(['Client', 'Lawyer', 'Admin']), updateInvestigationDetails);
router.post('/:caseId/request-lawyer', authorize(['Client']), requestLawyerForCase);


module.exports = router;