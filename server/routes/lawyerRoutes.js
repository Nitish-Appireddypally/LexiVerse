// server/routes/lawyerRoutes.js
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const { getMyProfile, updateMyProfile } = require('../controllers/lawyerController');

// All routes in this file will be for users with the 'Lawyer' role.

// Route to get the currently logged-in lawyer's own profile
router.get('/profile/me', authorize(['Lawyer']), getMyProfile);

// Route to create or update the currently logged-in lawyer's own profile
router.put('/profile/me', authorize(['Lawyer']), updateMyProfile);

module.exports = router;