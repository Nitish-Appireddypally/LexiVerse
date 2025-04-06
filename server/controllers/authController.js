const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET not set in .env");
}

const register = async (req, res) => {
  // const { name, email, password, role } = req.body;
  // console.log("➡️ Register API called with:", req.body);

  // try {
  //   const existingUser = await findUserByEmail(email);
  //   if (existingUser) return res.status(400).json({ message: "User already exists" });

  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const user = await createUser(name, email, hashedPassword, role);

  //   // Optionally auto-login after registration
  //   const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

  //   res.status(201).json({ token, user });
  // } catch (err) {
  //   console.error("❌ Register error:", err.message);
  //   res.status(500).json({ error: err.message });
  // }

  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);
  res.status(200).json({ message: "Reached controller" });
  return;
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("➡️ Login API called with:", req.body);

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token, user });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
};
