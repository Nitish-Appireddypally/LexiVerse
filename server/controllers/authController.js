// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { createUser, findUserByEmail } = require("../models/userModel");

// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//   console.error("❌ JWT_SECRET not set in .env");
// }

// const register = async (req, res) => {
//   // const { name, email, password, role } = req.body;
//   // console.log("➡️ Register API called with:", req.body);

//   // try {
//   //   const existingUser = await findUserByEmail(email);
//   //   if (existingUser) return res.status(400).json({ message: "User already exists" });

//   //   const hashedPassword = await bcrypt.hash(password, 10);
//   //   const user = await createUser(name, email, hashedPassword, role);

//   //   // Optionally auto-login after registration
//   //   const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

//   //   res.status(201).json({ token, user });
//   // } catch (err) {
//   //   console.error("❌ Register error:", err.message);
//   //   res.status(500).json({ error: err.message });
//   // }

//   console.log("HEADERS:", req.headers);
//   console.log("BODY:", req.body);
//   res.status(200).json({ message: "Reached controller" });
//   return;
// };

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   console.log("➡️ Login API called with:", req.body);

//   try {
//     const user = await findUserByEmail(email);
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
//     res.status(200).json({ token, user });
//   } catch (err) {
//     console.error("❌ Login error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   register,
//   login,
// };


const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const {getUserByEmail, createUser} = require('../models/userModel');

const loginUser = async (req, res) =>{
  const {email, password}=req.body;
  console.log(email,password);

  try{
    const user = await getUserByEmail(email);
    console.log("Fetched user:", user);
    if(!user) return res.status(401).json({message: 'Invalid credentials'});
    
    const isMatch = password === user.password;
    if (!isMatch) return res.status(401).json({message: 'Invalid credentails'});

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: '1h'}
    );
    res.json({token, user:{id: user.id, name: user.name, email: user.email, role: user.role}});
  }
  catch(err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }

};

const signupUser = async (req,res) => {
  const {name, email, password, role }= req.body;
  try{
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = await createUser({name, email, password, role});
    const token = jwt.sign(
      {id : newUser.id, email: newUser.email, role: newUser.role},
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    );
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })
  }
  catch(error){
    console.error("Register Error:", err.message);
    res.status(500).send("Server Error");
  }
}

module.exports = {loginUser, signupUser};
