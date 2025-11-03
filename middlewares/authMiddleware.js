const jwt = require("jsonwebtoken");
const Responses = require("../helpers/response");
const messages = require("../constants/constantMessages");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return Responses.failResponse(req, res, null, messages.noToken, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return Responses.failResponse(req, res, null, messages.invalidToken, 403);
  }
};

module.exports = { verifyToken };
