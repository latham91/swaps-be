require("dotenv").config();
const User = require("./userModel");
const jwt = require("jsonwebtoken");

exports.signupUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res
                .status(400)
                .json({ success: false, message: "Account already exists" });
        }

        const user = await User.create({ username, email, password });

        return res.status(201).json({
            success: true,
            message: "Account signed up successfully",
            user,
        });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Server error",
                source: "signupUser",
                error: error.message,
            });
    }
};
