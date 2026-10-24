import { Router } from "express";
import { createRoomController } from "../controllers/roomController.js";
// import { requireAuth } from "../middleware/requireAuth.js";
import { authRequire } from "../middlewares/authRequire.js";
import { joinRoomController } from "../controllers/joinRoomController.js";
import { getRoomController, listRoomMembersController, listRoomsController } from "../controllers/roomReadController.js";
import { leaveRoomController } from "../controllers/leaveRoomController.js";
import { getDrawingController, getGameStateController, startGameController } from "../controllers/gameController.js";

const router = Router();

router.use(authRequire);

router.post("/", authRequire, createRoomController);
router.post("/join", authRequire, joinRoomController);
router.post("/:code/game/start", startGameController);
router.get("/:code/game", getGameStateController);
router.get("/:code/game/drawings/:publicId", getDrawingController);
router.get("/", listRoomsController);
router.get("/:code", getRoomController);
router.delete("/:code/members/me", leaveRoomController);
router.get("/:code/members", listRoomMembersController);


export default router;
