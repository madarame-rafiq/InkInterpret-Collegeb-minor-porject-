import { Router } from "express";
import { createRoomController } from "../controllers/roomController.js";
// import { requireAuth } from "../middleware/requireAuth.js";
import { authRequire } from "../middlewares/authRequire.js";
import { joinRoomController } from "../controllers/joinRoomController.js";
import { getRoomController, listRoomsController } from "../controllers/roomReadController.js";

const router = Router();

router.post("/", authRequire, createRoomController);
router.post("/join", authRequire, joinRoomController);
router.get("/", listRoomsController);
router.get("/:code", getRoomController);

export default router;