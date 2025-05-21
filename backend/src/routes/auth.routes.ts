import { Router } from "express";
import { login, signup, getCurrentUser } from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
