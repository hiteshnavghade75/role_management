import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});