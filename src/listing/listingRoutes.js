const router = require("express").Router();
const verifyJwt = require("../middleware/verifyJwt");

const { createListing, getAllListings, getListingById, getUsersListings } = require("./listingController");

router.post("/post-listing", verifyJwt, createListing);
router.get("/get-all-listings", getAllListings);
router.get("/get-listing-by-id/:listingId", getListingById);
router.get("/get-users-listings/:userId", verifyJwt, getUsersListings);

module.exports = router;
