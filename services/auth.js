const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRETKEY


function generateToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        name: user.fullName,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    const token = jwt.sign(payload, secret);
    return token;
}

function verifyToken(token) {
    const payload = jwt.verify(token, secret);
    return payload;
}

module.exports = {
    generateToken,
    verifyToken
};