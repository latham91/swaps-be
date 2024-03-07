require("dotenv").config();
const User = require("./userModel");
const jwt = require("jsonwebtoken");

exports.signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "Account already exists" });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      success: true,
      message: "Account signed up successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      source: "signupUser",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const { id, username, email, password } = req.user;

    const token = jwt.sign({ id: id, username, email, password }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.cookie("swaps_auth", token, { httpOnly: true, maxAge: 600000 });

    return res.status(200).json({
      success: true,
      message: `${username} logged in`,
      user: req.user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      source: "loginUser",
      error: error.message,
    });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    return res.clearCookie("swaps_auth");
  } catch (error) {
    res.clearCookie("swaps_auth");
    return res.status(500).json({ success: false, message: "Error logging out", error: error.message });
  }
};
