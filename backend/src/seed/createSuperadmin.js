import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/user.js";

const run = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@gmail.com";

    let user = await User.findOne({ email });

    if (user) {
      console.log("Super Admin already exists:", user.email);
    } else {
      user = await User.create({
        email,
        name: process.env.ADMIN_NAME || "admin@gmail.com",
        role: "admin",
        status: "active",
      });
      console.log("✅ Super Admin created:", user.email);
    }
  } catch (err) {
    console.error("Error creating Super Admin:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
