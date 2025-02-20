import { Router } from "express";
import uiRoutes from "./uiRoutes";
import apiServiceRoutes from "./apiServiceRoutes";

const router = Router();

router.use("/ui", uiRoutes);
router.use("/api-service", apiServiceRoutes);

export default router;
