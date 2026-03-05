const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Save AI generated case insight
const saveAIInsight = async (req, res) => {
  const userId = req.user.id;
  const { insight } = req.body;

  try {
    const newInsight = await prisma.aIInsight.create({
      data: {
        user_id: userId,
        insight,
      },
    });

    res.status(201).json(newInsight);
  } catch (error) {
    console.error("Error saving AI insight:", error);
    res.status(500).json({ error: "Failed to save AI insight" });
  }
};

// Fetch latest AI insight for user
const getLatestAIInsight = async (req, res) => {
  const userId = req.user.id;

  try {
    const insight = await prisma.aIInsight.findFirst({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });

    res.status(200).json(insight);
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    res.status(500).json({ error: "Failed to fetch AI insight" });
  }
};

module.exports = {
  saveAIInsight,
  getLatestAIInsight,
};
