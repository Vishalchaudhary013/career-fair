import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const superAdminProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

      if (decoded.role === "SUPER_ADMIN") {
        req.user = await User.findById(decoded.id).select("-password");
        return next();
      }

      res.status(401).json({ message: "Not authorized as super admin" });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
