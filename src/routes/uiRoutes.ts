import { Router } from "express";
import { getFlows, getScenarioFormData } from "../controllers/uiController";
import validateRequiredParams from "../middleware/index";

const router = Router();

router.get(
  "/flow",
  validateRequiredParams(["domain", "version", "usecase"]),
  getFlows
);
router.get("/senario", getScenarioFormData);

export default router;
