const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/*
Save AI case draft
*/
exports.saveAIInsight = async (req, res) => {
  try {
    const insight = req.body.insight;

    const saved = await prisma.aIInsight.create({
      data: {
        user_id: 1, // temporary for development
        insight: insight,
      },
    });

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save AI insight" });
  }
};

/*
Get latest insight for autofill
*/
exports.getLatestInsight = async (req, res) => {
  try {
    const insight = await prisma.aIInsight.findFirst({
      where: { user_id: 1 },
      orderBy: { created_at: "desc" },
    });

    res.json(insight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch insight" });
  }
};
