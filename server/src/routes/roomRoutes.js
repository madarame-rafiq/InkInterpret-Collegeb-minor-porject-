import { Router } from "express";
import { createRoomController } from "../controllers/roomController.js";
// import { requireAuth } from "../middleware/requireAuth.js";
import { authRequire } from "../middlewares/authRequire.js";
import { joinRoomController } from "../controllers/joinRoomController.js";

const router = Router();

router.post("/", authRequire, createRoomController);
router.post("/join", authRequire, joinRoomController);

export default router;