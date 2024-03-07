const router = require("express").Router();
const verifyJwt = require("../middleware/verifyJwt");

const {
    createListing,
    getAllListings,
    getListingById,
} = require("./listingController");

router.post("/post-listing", verifyJwt, createListing);
router.get("/get-all-listings", getAllListings);
router.get("/get-listing-by-id", getListingById);

module.exports = router;
