const mongoose = require("mongoose");
import isEmail from "validator/lib/isEmail";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, "Please enter a valid Email"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    listingsArray: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
        },
    ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
