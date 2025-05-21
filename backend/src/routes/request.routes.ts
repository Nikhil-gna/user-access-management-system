import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/roles";
import {
  submitRequest,
  updateRequestStatus,
  getRequests,
} from "../controllers/request.controller";

const router = Router();
router.post("/", authMiddleware, authorizeRoles("Employee"), submitRequest);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("Manager"),
  updateRequestStatus
);
router.get("/", authMiddleware, getRequests);

export default router;
