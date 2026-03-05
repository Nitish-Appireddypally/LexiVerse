const express = require("express");
const router = express.Router();

const {
  saveAIInsight,
  getLatestInsight,
} = require("../controllers/aiInsightController");

// POST /api/ai-insights
router.post("/ai-insights", saveAIInsight);

// GET /api/ai-insights/latest
router.get("/ai-insights/latest", getLatestInsight);

module.exports = router;
