const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

function signToken(payload) {
  return jwt.sign(payload, jwtSecret);
}

function verifyToken(token) {
  return jwt.verify(token, jwtSecret);
}

module.exports = { signToken, verifyToken };
