import { Router } from "express";
import uiRoutes from "./uiRoutes";
import mockRoutes from "./mockRoutes";

const router = Router();

router.use("/ui", uiRoutes);
router.use("/mock", mockRoutes);

export default router;
