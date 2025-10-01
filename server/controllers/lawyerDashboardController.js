const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Get key stats for the lawyer's dashboard
// @route   GET /api/lawyers/dashboard/stats
// @access  Private (Lawyer only)
// @desc    Get key stats for the lawyer's dashboard
const getDashboardStats = async (req, res) => {
  const lawyerId = req.user.id;
  try {
    const [newRequests, activeCases, upcomingHearings] = await prisma.$transaction([
      prisma.caseParticipant.count({ where: { user_id: lawyerId, status: 'Pending' } }),
      prisma.caseParticipant.count({
        where: {
          user_id: lawyerId,
          status: 'Accepted',
          case: { status: { notIn: ['Resolved', 'Closed'] } },
        },
      }),
      prisma.hearing.count({
        where: {
          case: { participants: { some: { user_id: lawyerId, status: 'Accepted' } } },
          hearing_date: { gte: new Date() },
        },
      }),
    ]);
    res.status(200).json({ newRequests, activeCases, upcomingHearings });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a list of pending case requests for the lawyer
// @route   GET /api/lawyers/dashboard/requests
// @access  Private (Lawyer only)
const getCaseRequests = async (req, res) => {
  const lawyerId = req.user.id;
  try {
    const requests = await prisma.case.findMany({
      where: {
        participants: { some: { user_id: lawyerId, status: 'Pending' } },
      },
      include: {
        participants: {
          where: { role_in_case: 'Petitioner' },
          select: { user: { select: { name: true } } },
        },
      },
      orderBy: { created_at: 'desc' }
    });
    // Format the data for the frontend
    const formattedRequests = requests.map(r => ({
        id: r.id,
        clientName: r.participants[0]?.user?.name || 'Unknown Client',
        caseType: r.case_type,
        date: r.created_at
    }));
    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error("Error fetching case requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a list of upcoming hearings for the lawyer
// @route   GET /api/lawyers/dashboard/hearings
// @access  Private (Lawyer only)
const getUpcomingHearings = async (req, res) => {
    const lawyerId = req.user.id;
    try {
        const hearings = await prisma.hearing.findMany({
            where: {
                hearing_date: { gte: new Date() },
                case: {
                    participants: { some: { user_id: lawyerId, status: 'Accepted' } }
                }
            },
            include: {
                case: { select: { title: true } }
            },
            orderBy: { hearing_date: 'asc' },
            take: 5 // Limit to the next 5 hearings for the dashboard
        });

        // Format data for the frontend
        const formattedHearings = hearings.map(h => ({
            id: h.id,
            caseTitle: h.case.title,
            date: h.hearing_date,
            court: 'Court details to be added' // Placeholder for now
        }));
        res.status(200).json(formattedHearings);
    } catch (error) {
        console.error("Error fetching upcoming hearings:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// server/controllers/lawyerDashboardController.js

// --- START: CORRECTED FUNCTION ---
// @desc    Respond to a case request (Accept or Decline)
const respondToCaseRequest = async (req, res) => {
  const lawyerId = req.user.id;
  const lawyerName = req.user.name;
  const caseId = parseInt(req.params.caseId);
  const { status } = req.body; // This will be 'Accepted' or 'Declined'

  if (status !== 'Accepted' && status !== 'Declined') {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    // We create an array to hold our database operations
    const transactionOps = [
      // Operation 1: Update the CaseParticipant status
      prisma.caseParticipant.update({
        where: {
          case_id_user_id: { case_id: caseId, user_id: lawyerId },
          status: 'Pending',
        },
        data: { status: status }, // Uses 'Accepted' or 'Declined' (a valid CaseParticipantStatus)
        include: {
          case: {
            include: {
              participants: { where: { role_in_case: 'Petitioner' } }
            }
          }
        }
      })
    ];

    // If the lawyer accepted the case, add a second operation to the transaction
    if (status === 'Accepted') {
      transactionOps.push(
        // Operation 2: Update the main Case status
        prisma.case.update({
          where: { id: caseId },
          data: { status: 'Lawyer_Engaged' } // Uses 'Lawyer_Engaged' (a valid CaseStatus)
        })
      );
    }

    // Execute both operations together in a single transaction
    const [updatedParticipant] = await prisma.$transaction(transactionOps);

    // Create a notification for the client if the case was accepted
    if (status === 'Accepted') {
      const client = updatedParticipant.case.participants[0];
      if (client) {
        await prisma.notification.create({
          data: {
            user_id: client.user_id,
            message: `Lawyer ${lawyerName} has accepted your case: "${updatedParticipant.case.title}"`,
            link: `/case/${caseId}`
          }
        });
      }
    }
    
    res.status(200).json({ message: `Case request ${status.toLowerCase()}.`});
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Case request not found or has already been actioned.' });
    }
    console.error("Error responding to case request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all active cases for the logged-in lawyer
// @route   GET /api/lawyers/dashboard/active-cases
// @access  Private (Lawyer only)
const getActiveCases = async (req, res) => {
  const lawyerId = req.user.id;
  try {
    const activeCases = await prisma.case.findMany({
      where: {
        participants: {
          some: {
            user_id: lawyerId,
            status: 'Accepted'
          }
        },
        status: { notIn: ['Resolved', 'Closed'] }
      },
      include: {
        participants: {
          where: { role_in_case: 'Petitioner' },
          select: { user: { select: { name: true } } }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const formattedCases = activeCases.map(c => ({
      id: c.id,
      title: c.title,
      clientName: c.participants[0]?.user?.name || 'N/A',
      status: c.status,
      dateAccepted: c.created_at // We can refine this later
    }));

    res.status(200).json(formattedCases);
  } catch (error) {
    console.error("Error fetching active cases:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getDashboardStats,
  getCaseRequests,
  getUpcomingHearings,
  respondToCaseRequest, // Export the new function
   getActiveCases,
};