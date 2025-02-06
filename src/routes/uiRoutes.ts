import { Router } from "express";
import { getFlows } from "../controllers/uiController";
import validateRequiredParams from "../middleware/index";

const router = Router();

router.get(
  "/flow",
  validateRequiredParams(["domain", "version", "usecase"]),
  getFlows
);

export default router;
