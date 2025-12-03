const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendMail = require("../services/emailService");
const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, rollNo, staffId } = req.body;
  
router.post("/google", async (req, res) => {
  try {
    const { name, email } = req.body;

    let user = await User.findOne({ email });

    
    if (user) {
      return res.json({
        message: "Login Successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    
    user = new User({
      name,
      email,
      role: "Student",
      password: "", 
    });

    await user.save();

    return res.json({
      message: "Google Account Registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Google Login Error" });
  }
});


   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      rollNo: role === "Student" ? rollNo : undefined,
      staffId: role === "Staff" ? staffId : undefined,
    });

    await newUser.save();

    
    await sendMail(
      email,
      "Welcome to Automated Task System",
      `Dear ${name},\n\nYour registration as a ${role} was successful.\n\nYou can now log in and start using the system.\n\nBest regards,\nAutomated Task System`
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});


router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const results = await User.find({
      name: { $regex: q, $options: "i" },
    }).select("name email role rollNo staffId");

    if (results.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

