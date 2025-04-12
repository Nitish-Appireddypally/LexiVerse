const express = require("express");
const { loginUser, signupUser } = require("../controllers/authController");

const router = express.Router();

// router.use((req, res, next) => {
//   console.log(`➡️ Auth Route Hit: ${req.method} ${req.originalUrl}`);
//   next();
// });

router.post("/register", signupUser);
router.post("/login", loginUser);

module.exports = router;
