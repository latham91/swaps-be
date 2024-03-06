const router = require("express").Router();
const { comparePassword, hashPassword } = require("../middleware/auth");
const { signupUser, loginUser } = require("./userController");

router.post("/signup", hashPassword, signupUser);
router.post("/login", comparePassword, loginUser);

module.exports = router;
