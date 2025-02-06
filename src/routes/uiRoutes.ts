import { Router } from "express";
import { getFlows } from "../controllers/uiController";

const router = Router();

router.get("/flow", getFlows);

export default router;
