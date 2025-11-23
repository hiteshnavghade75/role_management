import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "email role status"
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.status === "inactive") {
      return res
        .status(403)
        .json({ message: "User is deactivated. Cannot access system." });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Admin access required" });
  }
  next();
};