require("dotenv").config();
const User = require("./userModel");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
    try {
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
