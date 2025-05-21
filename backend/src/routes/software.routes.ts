import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/roles";
import {
  createSoftware,
  getAllSoftware,
} from "../controllers/software.controller";

const router = Router();
router.post("/", authMiddleware, authorizeRoles("Admin"), createSoftware);
router.get("/", authMiddleware, getAllSoftware);
export default router;
