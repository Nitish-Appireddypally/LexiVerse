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
// --- START: UPDATED updateMyProfile FUNCTION ---
const updateMyProfile = async (req, res) => {
  const lawyerId = req.user.id;
  const { bar_council_id, specializations, experience_years, bio } = req.body;

  try {
    // Check if a profile for this lawyer already exists
    const existingProfile = await prisma.lawyerProfile.findUnique({
      where: { user_id: lawyerId },
    });

    let profile;
    const profileData = {
      bar_council_id,
      specializations,
      experience_years: Number(experience_years) || 0, // Ensure it's a number
      bio,
    };

    if (existingProfile) {
      // If it exists, UPDATE it
      profile = await prisma.lawyerProfile.update({
        where: { user_id: lawyerId },
        data: profileData,
      });
    } else {
      // If it does not exist, CREATE it
      profile = await prisma.lawyerProfile.create({
        data: {
          user_id: lawyerId,
          ...profileData,
        },
      });
    }
    
    res.status(200).json({ message: 'Profile updated successfully!', profile });
  } catch (error) {
    console.error('Error updating lawyer profile:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};
// --- END: UPDATED updateMyProfile FUNCTION ---



const getAllVerifiedLawyers = async (req, res) => {
  const { specialization } = req.query; // Get filter from URL query string

  try {
    let whereClause = {
      is_verified: true, // IMPORTANT: Only show verified lawyers
    };

    // If a specialization filter is provided, add it to the query
    if (specialization) {
      whereClause.specializations = {
        has: specialization, // Prisma command to check if an array contains a value
      };
    }

    const lawyers = await prisma.lawyerProfile.findMany({
      where: whereClause,
      include: {
        // Include the public-facing user details
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json(lawyers);
  } catch (error) {
    console.error('Error fetching verified lawyers:', error);
    res.status(500).json({ message: 'Server error while fetching lawyers.' });
  }
};


module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllVerifiedLawyers, // Export the new function
};