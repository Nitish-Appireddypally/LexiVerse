// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const { authorize } = require('../middleware/authMiddleware'); // Use our powerful middleware

// Any logged-in user can access their own data
router.get('/me', authorize(['Client', 'Lawyer', 'Admin']), getMe);

module.exports = router;