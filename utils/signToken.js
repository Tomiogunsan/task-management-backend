const jwt = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

module.exports = signToken;
