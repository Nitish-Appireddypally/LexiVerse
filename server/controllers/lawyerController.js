// server/controllers/lawyerController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get the profile of the currently logged-in lawyer
// @route   GET /api/lawyers/profile/me
// @access  Private (Lawyer only)
const getMyProfile = async (req, res) => {
  const lawyerId = req.user.id;
  try {
    const profile = await prisma.lawyerProfile.findUnique({
      where: { user_id: lawyerId },
      include: {
        user: { // Also include the base user info
          select: { name: true, email: true, phone_number: true, address: true }
        }
      }
    });

    if (!profile) {
      return res.status(200).json({ message: 'Profile not yet created.', profile: null });
    }
    res.status(200).json({ profile });
  } catch (error) {
    console.error('Error fetching lawyer profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

// @desc    Create or update the profile of the currently logged-in lawyer
// @route   PUT /api/lawyers/profile/me
// @access  Private (Lawyer only)
const updateMyProfile = async (req, res) => {
  const lawyerId = req.user.id;
  const { bar_council_id, specializations, experience_years, bio } = req.body;

  try {
    // Use `upsert` to create the profile if it doesn't exist, or update it if it does.
    const profile = await prisma.lawyerProfile.upsert({
      where: { user_id: lawyerId },
      update: {
        bar_council_id,
        specializations,
        experience_years,
        bio,
      },
      create: {
        user_id: lawyerId,
        bar_council_id,
        specializations,
        experience_years,
        bio,
      }
    });
    res.status(200).json({ message: 'Profile updated successfully!', profile });
  } catch (error) {
    console.error('Error updating lawyer profile:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};