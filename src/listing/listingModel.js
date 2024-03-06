const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 3,
        },
        description: {
            type: String,
            required: true,
            minlength: 25,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        offersArray: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Offer",
            },
        ],
    },
    { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
