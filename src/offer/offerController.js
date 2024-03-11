const Offer = require("./offerModel");
const Listing = require("../listing/listingModel");

exports.offerTrade = async (req, res) => {
  try {
    const { wantedListingId } = req.params;
    const offerListingId = req.body.offeredId;

    const wantedListing = await Listing.findById(wantedListingId);
    const offerListing = await Listing.findById(offerListingId);

    if (!wantedListing || !offerListing) {
      return res.status(400).json({
        success: false,
        message: "Listings not found",
      });
    }

    const offerExists = await Offer.findOne({ wantedListingId, offerListingId });

    if (offerExists) {
      return res.status(400).json({
        success: false,
        message: "Offer already exists",
      });
    }

    const newOffer = await Offer.create({ wantedListingId: wantedListing._id, offerListingId: offerListing._id });
    const addToWantedListing = wantedListing.offersArray.push(newOffer._id);

    if (!newOffer || !addToWantedListing) {
      return res.status(400).json({
        success: false,
        message: "Offer not created",
      });
    }

    const saveWantedListing = await wantedListing.save();

    if (!saveWantedListing) {
      return res.status(400).json({
        success: false,
        message: "Offer not added to wanted listing",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer created and added to wanted listing",
      newOffer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.declineOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { id } = req.user;

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(400).json({
        success: false,
        message: "Offer not found",
      });
    }

    // check to see if the user owns the wanted listing
    const wantedListing = await Listing.findById(offer.wantedListingId);

    if (wantedListing.userId.toString() !== id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const deleteOffer = await Offer.findByIdAndDelete(offerId);

    if (!deleteOffer) {
      return res.status(400).json({
        success: false,
        message: "Offer not deleted",
      });
    }

    // remove the offer from the wanted listing
    const removeOffer = await wantedListing.offersArray.pull(offerId);

    if (!removeOffer) {
      return res.status(400).json({
        success: false,
        message: "Offer not removed from wanted listing",
      });
    }

    const saveWantedListing = await wantedListing.save();

    if (!saveWantedListing) {
      return res.status(400).json({
        success: false,
        message: "Offer not removed from wanted listing",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer declined",
      offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.acceptOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { id } = req.user;

    const offer = await Offer.findById(offerId);

    if (!offer) {
      return res.status(400).json({
        success: false,
        message: "Offer not found",
      });
    }

    // check to see if the user owns the wanted listing
    const wantedListing = await Listing.findById(offer.wantedListingId);

    if (wantedListing.userId.toString() !== id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // change offer isAccepted to true
    offer.isAccepted = true;
    const saveOffer = await offer.save();

    if (!saveOffer) {
      return res.status(400).json({
        success: false,
        message: "Offer not saved",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer accepted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
