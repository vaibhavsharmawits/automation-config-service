import { Router } from "express";
import validateRequiredParams from "../middleware/index";
import { getFlow } from "../controllers/mockController";

const router = Router();

router.get(
  "/flow",
  validateRequiredParams(["domain", "version", "usecase", "flowId"]),
  getFlow
);

export default router;
