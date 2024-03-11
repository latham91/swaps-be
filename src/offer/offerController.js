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
      source: "offerTrade",
      error: error.message,
    });
  }
};
