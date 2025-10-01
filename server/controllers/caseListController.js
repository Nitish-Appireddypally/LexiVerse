const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCase = async (req, res) => {
  const { complainantDetails, offenseDetails, accusedPersons, witnesses, caseNarrative } = req.body;
  const clientId = req.user.id; 
  try {
    const newCase = await prisma.case.create({
      data: {
        title: caseNarrative.title,
        case_type: caseNarrative.caseType,
        description: caseNarrative.incidentDetails,
        status: 'Submitted',
        full_details: { complainant: complainantDetails, offense: offenseDetails, accused: accusedPersons, witnesses: witnesses },
        participants: { create: { user_id: clientId, role_in_case: 'Petitioner' } }
      }
    });
    res.status(201).json(newCase);
  } catch (error) {
    console.error("Error submitting case:", error);
    res.status(500).json({ error: "Failed to submit case" });
  }
};

const getAllCases = async (req, res) => {
  try {
    const allCases = await prisma.case.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        participants: { include: { user: { select: { name: true, email: true } } } }
      }
    });
    res.status(200).json(allCases);
  } catch (error) {
    console.error("Error fetching all cases:", error);
    res.status(500).json({ error: "Failed to fetch all cases" });
  }
};

const getMyCases = async (req, res) => {
  const userId = req.user.id;
  try {
    const userCases = await prisma.case.findMany({
      where: { participants: { some: { user_id: userId } } },
      orderBy: { created_at: 'desc' },
      include: { participants: { include: { user: { select: { name: true } } } } }
    });
    res.status(200).json(userCases);
  } catch (error) {
     console.error("Error fetching user's cases:", error);
     res.status(500).json({ error: "Failed to fetch your cases" });
  }
};

const updateCaseStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedCase = await prisma.case.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.status(200).json(updatedCase);
  } catch (error) {
    console.error("Error updating case status:", error);
    res.status(500).json({ error: "Failed to update case status" });
  }
};

module.exports = { createCase, getAllCases, getMyCases, updateCaseStatus };