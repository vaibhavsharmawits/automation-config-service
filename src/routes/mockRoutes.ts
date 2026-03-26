import { Router } from "express";
import validateRequiredParams from "../middleware/index";
import { getFlow, getPlaygroundFlowConfig } from "../controllers/mockController";

const router = Router();

router.get(
  "/flow",
  validateRequiredParams(["domain", "version", "usecase", "flowId"]),
  getFlow
);
router.get(
  "/playground",
  validateRequiredParams(["domain", "version", "usecase", "flowId"]),
  getPlaygroundFlowConfig
);
export default router;
