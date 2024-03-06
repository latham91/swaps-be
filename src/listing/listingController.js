const Listing = require("./listingModel");

exports.getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find({});

        if (!listings) {
            return res
                .status(400)
                .json({ success: false, message: "No listings found" });
        }
        return res
            .status(200)
            .json({ success: true, message: "All listings", listings });
    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: "Server error",
            source: "getAllListings",
            error: error.message,
        });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(400).json({
                sucess: false,
                message: "No listing found with ID:",
                id,
            });
        }
        return res
            .status(200)
            .json({ success: true, message: "Listing found", listing });
    } catch (error) {
        return res
            .status(500)
            .json({
                success: false,
                message: "Server error",
                source: "getListingById",
                error: error.message,
            });
    }
};
