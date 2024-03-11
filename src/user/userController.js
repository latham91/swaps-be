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

    res.cookie("swaps_auth", token, {
      maxAge: 900000,
      sameSite: "None",
      secure: true,
      httpOnly: false,
      partitioned: true,
    });

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
    res.clearCookie("insta_auth", {
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({ success: true, message: `${req.user.username} logged out` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error logging out", error: error.message });
  }
};

exports.userSession = async (req, res) => {
  try {
    await User.findById(req.user.id);
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.clearCookie("swaps_auth");
    return res.status(500).json({ success: false, message: "Invalid session", error: error.message });
  }
};
