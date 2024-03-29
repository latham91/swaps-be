const Listing = require("./listingModel");
const User = require("../user/userModel");
const Offer = require("../offer/offerModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createListing = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title || !image || !description) {
      return res.status(400).json({
        success: false,
        message: "You must provide a title, description, and at least 1 image",
      });
    }

    const imageUrl = await cloudinary.uploader.upload(image);

    const listing = await Listing.create({
      title,
      description,
      imageUrl: imageUrl.secure_url,
      userId: req.user.id,
    });

    const addListingToUser = await User.findByIdAndUpdate({ _id: req.user.id }, { $push: { listings: listing._id } });

    if (!addListingToUser || !listing) {
      return res.status(400).json({ success: false, message: "Could not add listing to user" });
    }

    return res.status(200).json({ success: true, message: "Listing posted", listing });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      source: "createListing",
    });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate({ path: "userId", select: "-password -__v -listings" })
      .sort({ createdAt: -1 });

    if (!listings) {
      return res.status(400).json({ success: false, message: "No listings found" });
    }
    return res.status(200).json({ success: true, message: "All listings", listings });
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
    const id = req.params.listingId;
    const listing = await Listing.findById(id)
      .populate("userId")
      .populate([
        { path: "offersArray" },
        {
          path: "offersArray",
          populate: {
            path: "offerListingId",
            populate: {
              path: "userId",
            },
          },
        },
      ]);

    if (!listing) {
      return res.status(400).json({
        sucess: false,
        message: "No listing found with ID:",
        id,
      });
    }
    return res.status(200).json({ success: true, message: "Listing found", listing });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      source: "getListingById",
      error: error.message,
    });
  }
};

exports.getUsersListings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const listings = await Listing.find({ userId }).populate("userId", "-password -__v -listingsArray");

    if (!listings) {
      return res.status(400).json({ success: false, message: "No listings found for user" });
    }
    return res.status(200).json({ success: true, message: "Users listings", listings });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      source: "getUsersListings",
      error: error.message,
    });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { id } = req.user;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(400).json({ success: false, message: "Listing not found" });
    }

    if (listing.userId.toString() !== id) {
      return res.status(400).json({ success: false, message: "Unauthorized" });
    }

    // Remove offers from the database
    const deleteOffers = await Offer.deleteMany({ offerListingId: listingId });

    if (!deleteOffers) {
      return res.status(400).json({ success: false, message: "Failed to delete offers" });
    }

    // Remove the listing from the user's listings array
    const removeListingFromUser = await User.findByIdAndUpdate({ _id: id }, { $pull: { listings: listingId } });

    if (!removeListingFromUser) {
      return res.status(400).json({ success: false, message: "Failed to remove listing from user" });
    }

    // Remove the listing from the database
    const deleteListing = await Listing.findByIdAndDelete(listingId);

    if (!deleteListing) {
      return res.status(400).json({ success: false, message: "Failed to delete listing" });
    }

    return res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error 2",
      error: error.message,
    });
  }
};
