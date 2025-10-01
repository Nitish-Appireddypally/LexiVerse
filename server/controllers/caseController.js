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
            user: { select: { id: true, name: true } }
          }
        },
        fir: true, // CORRECTED: from 'firs' to 'fir' (singular)
        documents: true, // CORRECTED: from 'case_documents' to 'documents'
      }
    });

    if (!caseData) {
      return res.status(404).json({ message: 'Case not found.' });
    }

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

// @desc    Client requests a lawyer for a specific case
// @route   POST /api/cases/:caseId/request-lawyer
// @access  Private (Client only)
const requestLawyerForCase = async (req, res) => {
  const caseId = parseInt(req.params.caseId);
  const { lawyerId } = req.body; // The ID of the lawyer being requested
  const clientId = req.user.id;

  try {
    // 1. Security Check: Verify the person making the request is the petitioner of the case
    const caseParticipant = await prisma.caseParticipant.findUnique({
      where: {
        case_id_user_id: {
          case_id: caseId,
          user_id: clientId,
        },
        role_in_case: 'Petitioner',
      },
    });

    if (!caseParticipant) {
      return res.status(403).json({ message: 'Forbidden: You are not the petitioner for this case.' });
    }
    
    // 2. Create the new participant record for the lawyer with 'Pending' status
    const newParticipant = await prisma.caseParticipant.create({
      data: {
        case_id: caseId,
        user_id: lawyerId,
        role_in_case: 'LeadCounsel', // Assigning them as potential lead counsel
        status: 'Pending',
      },
    });

    res.status(201).json({ message: 'Request sent to lawyer successfully!', participant: newParticipant });
  } catch (error) {
    // Handle cases where the lawyer might have already been requested for this case
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'You have already requested this lawyer for this case.' });
    }
    console.error('Error requesting lawyer:', error);
    res.status(500).json({ message: 'Server error while sending request.' });
  }
};


module.exports = {
  getCaseById,
  requestLawyerForCase, // Export the new function
};