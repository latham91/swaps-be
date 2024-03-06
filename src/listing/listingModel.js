const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
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
