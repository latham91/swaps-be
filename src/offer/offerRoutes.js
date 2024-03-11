const router = require("express").Router();
const verifyJwt = require("../middleware/verifyJwt");
const { offerTrade } = require("./offerController");

router.post("/swap/:wantedListingId", verifyJwt, offerTrade);

module.exports = router;
