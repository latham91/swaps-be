const router = require("express").Router();
const verifyJwt = require("../middleware/verifyJwt");
const { offerTrade, declineOffer, acceptOffer } = require("./offerController");

router.post("/swap/:wantedListingId", verifyJwt, offerTrade);
router.delete("/decline-offer/:offerId", verifyJwt, declineOffer);
router.post("/accept-offer/:offerId", verifyJwt, acceptOffer);

module.exports = router;
