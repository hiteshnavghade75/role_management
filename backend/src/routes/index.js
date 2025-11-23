import { Router } from "express";

import authRoutes from "./auth.routes.js";
// import adminRoutes from "./admin.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
// router.use("/admin", adminRoutes);
router.use("/", userRoutes);

export default router;
