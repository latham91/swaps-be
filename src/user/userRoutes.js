const router = require("express").Router();
const { comparePassword, hashPassword } = require("../middleware/auth");
const verifyJwt = require("../middleware/verifyJwt");
const { signupUser, loginUser, logoutUser, userSession } = require("./userController");

router.post("/signup", hashPassword, signupUser);
router.post("/login", comparePassword, loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.get("/session", verifyJwt, userSession);

module.exports = router;
