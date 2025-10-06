// server/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get current logged-in user's data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  const userId = req.user.id; // Get user ID from the middleware

  try {
    // Fetch the full user profile from the database, excluding the password
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone_number: true,
        address: true,
        father_name: true,
        date_of_birth: true,
        gender: true,
        aadhar_number: true,
        profile_pic_url: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching full user profile:", error);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
};

const updateMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, phone_number, address, father_name, date_of_birth, gender, aadhar_number } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone_number,
        address,
        father_name,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender,
        aadhar_number,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error while updating profile." });
  }
};

module.exports = {
  getMe,
  updateMyProfile,
};