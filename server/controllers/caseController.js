const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get a single case by ID
// @route   GET /api/cases/:id
// @access  Private (Participants and Admins only)
const getCaseById = async (req, res) => {
  const caseId = parseInt(req.params.id);
  const user = req.user;

  try {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        participants: {
          include: {
            user: { select: { name: true } }
          }
        },
        firs: true, // Include FIR details if they exist
      }
    });

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found.' });
    }

    // Security Check: Allow access only if the user is an Admin or a participant in the case
    const isParticipant = caseData.participants.some(p => p.user_id === user.id);
    if (user.role !== 'Admin' && !isParticipant) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this case.' });
    }

    res.status(200).json(caseData);
  } catch (error) {
    console.error("Error fetching single case:", error);
    res.status(500).json({ message: "Server error while fetching case." });
  }
};

module.exports = {
  getCaseById
};