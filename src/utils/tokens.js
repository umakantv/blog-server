const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");


function generateToken(data) {
    return jwt.sign(data, JWT_SECRET);
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken,
}