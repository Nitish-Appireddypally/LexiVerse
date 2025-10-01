const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const { getUnreadCount, getMyNotifications, markNotificationsAsRead } = require('../controllers/notificationController');

// All routes here are for the logged-in user, so they should be protected.
// We allow any authenticated role to get their own notifications.
router.get('/unread-count', authorize(['Client', 'Lawyer', 'Admin']), getUnreadCount);
router.get('/', authorize(['Client', 'Lawyer', 'Admin']), getMyNotifications);
router.put('/mark-read', authorize(['Client', 'Lawyer', 'Admin']), markNotificationsAsRead);


module.exports = router;