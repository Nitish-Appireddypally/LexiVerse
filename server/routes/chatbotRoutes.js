const express = require("express");
const router = express.Router();
const axios = require("axios");

// The URL of our running Python Flask AI service
const AI_SERVICE_URL = "http://localhost:5001/chat";

// POST /api/chatbot/chat
router.post("/chat", async (req, res) => {
  const { prompt, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Forward the request to the Python Flask AI service
    const aiServiceResponse = await axios.post(AI_SERVICE_URL, {
      prompt: prompt,
      history: history || [], // Ensure history is an array
    });

    // Send the response from the AI service back to the React client
    res.json(aiServiceResponse.data);

  } catch (error) {
    console.error("Error communicating with AI service:", error.message);
    // Send a generic error message to the client
    res.status(500).json({ error: "Failed to get response from the AI service." });
  }
});

module.exports = router;