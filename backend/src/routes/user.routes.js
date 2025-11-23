// src/routes/admin.routes.js
import { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateUserStatus,
} from "../controllers/user.controller.js";
import { auth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(auth, requireAdmin);

router.get("/users", getAllUsers);

router.post("/users", createUser);

router.patch("/users/:id/status", updateUserStatus);

export default router;
