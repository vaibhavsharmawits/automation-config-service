import { Router } from "express";
import { getSupportedActions } from "../controllers/apiServiceController";
import validateRequiredParams from "../middleware/index";

const router = Router();

router.get(
  "/supportedActions",
  validateRequiredParams(["domain", "version"]),
  getSupportedActions
);

export default router;
