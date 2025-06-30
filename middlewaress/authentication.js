// middlewaress/authentication.js
const { verifyToken } = require("../services/auth");

function checkForAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return next(); // allow guest access
    }

    try {
        const payload = verifyToken(token);
        req.user = payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        req.user = null;
    }

    next();
}

module.exports = { checkForAuth };
