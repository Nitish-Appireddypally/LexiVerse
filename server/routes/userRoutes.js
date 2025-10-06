// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware'); // Use our powerful middleware
const { getMe, updateMyProfile } = require('../controllers/userController');


// Any logged-in user can access their own data
router.get('/me', authorize(['Client', 'Lawyer', 'Admin']), getMe);
router.put('/me', authorize(['Client', 'Lawyer', 'Admin']), updateMyProfile); // 👈 ADD THIS LINE


module.exports = router;