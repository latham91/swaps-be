const Listing = require("./listingModel");

exports.createListing = async (req, res) => {
    try {
        const { title, description, imageUrl } = req.body;

        if (!title || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: "You must provide a title and at least 1 image",
            });
        }
        const listing = await Listing.create({
            title,
            description,
            imageUrl,
        });
        return res
            .status(200)
            .json({ success: true, message: "Listing posted", listing });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            source: "createListing",
            error: error.message,
        });
    }
};

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
        const id = req.params.id;
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
        return res.status(500).json({
            success: false,
            message: "Server error",
            source: "getListingById",
            error: error.message,
        });
    }
};
