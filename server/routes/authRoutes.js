const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

router.use((req, res, next) => {
  console.log(`➡️ Auth Route Hit: ${req.method} ${req.originalUrl}`);
  next();
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
