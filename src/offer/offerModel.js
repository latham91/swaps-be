const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
    {
        wantedListingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        offerListingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        isAccepted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;
