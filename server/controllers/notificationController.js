const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get the count of unread notifications for the logged-in user
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  const userId = req.user.id;
  try {
    const count = await prisma.notification.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  const userId = req.user.id;
  try {
    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10, // Get the 10 most recent notifications
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark all unread notifications as read
// @route   PUT /api/notifications/mark-read
// @access  Private
const markNotificationsAsRead = async (req, res) => {
  const userId = req.user.id;
  try {
    await prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
    res.status(200).json({ message: 'Notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUnreadCount,
  getMyNotifications,
  markNotificationsAsRead,
};