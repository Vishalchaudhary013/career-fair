/**
 * Function is used to provide the authentication mechanism for admins and super admins.
 */
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = (req, res, next) => {
  // const token = req.header('Authorization');
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1]; // B
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Set the user information to the request object
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

module.exports = authenticate;
