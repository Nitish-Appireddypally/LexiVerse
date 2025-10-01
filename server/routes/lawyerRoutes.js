// server/routes/lawyerRoutes.js
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const { getMyProfile, updateMyProfile, getAllVerifiedLawyers } = require('../controllers/lawyerController');
// 👇 1. Import the new dashboard controller functions
const { 
  getDashboardStats, 
  getCaseRequests, 
  getUpcomingHearings,
  respondToCaseRequest,
  getActiveCases
} = require('../controllers/lawyerDashboardController');


// This should be accessible by any logged-in user.
router.get('/', authorize(['Client', 'Lawyer', 'Admin']), getAllVerifiedLawyers);

// All routes in this file will be for users with the 'Lawyer' role.

// Route to get the currently logged-in lawyer's own profile
router.get('/profile/me', authorize(['Lawyer']), getMyProfile);

// Route to create or update the currently logged-in lawyer's own profile
router.put('/profile/me', authorize(['Lawyer']), updateMyProfile);

// --- 👇 2. Add new Dashboard Routes ---
router.get('/dashboard/stats', authorize(['Lawyer']), getDashboardStats);
router.get('/dashboard/requests', authorize(['Lawyer']), getCaseRequests);
router.get('/dashboard/hearings', authorize(['Lawyer']), getUpcomingHearings);
router.get('/dashboard/active-cases', authorize(['Lawyer']), getActiveCases);


router.put('/dashboard/requests/:caseId', authorize(['Lawyer']), respondToCaseRequest);


module.exports = router;