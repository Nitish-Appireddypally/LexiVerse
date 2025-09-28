// server/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get current logged-in user's data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  // Our `protect` middleware already fetched the user and attached it to req.user
  // We just need to send it back.
  res.status(200).json(req.user);
};

module.exports = {
  getMe,
};