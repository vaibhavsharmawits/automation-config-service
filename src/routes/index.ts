import { Router } from "express";
import uiRoutes from "./uiRoutes";
import apiServiceRoutes from "./apiServiceRoutes";
import mockRoutes from "./mockRoutes";
import protocolRoutes from "./protocolRoutes";

const router = Router();

router.use("/ui", uiRoutes);
router.use("/api-service", apiServiceRoutes);
router.use("/mock", mockRoutes);
router.use("/protocol", protocolRoutes);

export default router;
