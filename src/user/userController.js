require("dotenv").config();
const User = require("./userModel");
const Offer = require("../offer/offerModel");
const Listing = require("../listing/listingModel");

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
      maxAge: 3600000,
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
    res.clearCookie("swaps_auth", {
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", source: "logoutUser", error: error.message });
  }
};

exports.userSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id username email");

    sessionUser = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.status(200).json({ success: true, user: sessionUser });
  } catch (error) {
    await res.clearCookie("swaps_auth", {
      secure: true,
      sameSite: "None",
    });

    return res.status(500).json({
      success: false,
      message: "Invalid session",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.user;

    const userExists = await User.findById(id);

    if (!userExists) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    await User.findByIdAndDelete(id);

    res.clearCookie("swaps_auth", {
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({ sucess: true, message: `User deleted` });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      message: "Error deleting account",
      error: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findById(id);

    if (!userExists) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    await User.findByIdAndUpdate(id, { username, email, password }, { new: true });

    return res.status(200).json({
      success: true,
      message: "User updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
