const router = require("express").Router();
const { comparePassword, hashPassword } = require("../middleware/auth");
const verifyJwt = require("../middleware/verifyJwt");
const { signupUser, loginUser, logoutUser, userSession, deleteUser, updateUser } = require("./userController");

router.post("/signup", hashPassword, signupUser);
router.post("/login", comparePassword, loginUser);
router.post("/logout", verifyJwt, logoutUser);
router.get("/session", verifyJwt, userSession);
router.delete("/delete", verifyJwt, deleteUser);
router.put("/update", verifyJwt, hashPassword, updateUser);

module.exports = router;
