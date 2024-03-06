const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
    const token = req.cookies.swaps_auth;

    if (!token) {
        res.clearCookie("swaps_auth");
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            res.clearCookie("swaps_auth");
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        req.user = decoded;

        next();
    } catch (error) {
        res.clearCookie("swaps_auth");
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

module.exports = verifyJwt;
