const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./.env"});
const pool = require("./config/db");


const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON data


// Simple route
app.get("/", (req, res) => {
  res.send("LexiVerse Backend is Running!");
});

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
