require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../user/userModel");

const saltRounds = parseInt(process.env.SALT_ROUNDS);

exports.hashPassword = async (req, res, next) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required" });
        }

        const hashed = await bcrypt.hash(password, saltRounds);
        req.body.password = hashed;

        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.comparePassword = async (req, res, next) => {
    try {
        const { password, email } = req.body;

        if (!password || !email) {
            return res.status(400).json({ success: false, message: "Email and password fields are required" });
        }

        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(400).json({ success: false, message: "Account not found" });
        }

        const match = await bcrypt.compare(password, userExists.password);

        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        req.user = {
            id: userExists._id,
            username: userExists.username,
            email: userExists.email,
        };

        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
