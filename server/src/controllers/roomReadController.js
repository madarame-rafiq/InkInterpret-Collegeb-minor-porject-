import {
  listUserRooms,
  getRoomForMember,
  listRoomMembers,
} from "../services/roomReadService.js";

export async function listRoomsController(req, res, next) {
  try {
    const rooms = await listUserRooms(req.session.userId);

    return res.status(200).json({
      status: "success",
      data: { rooms },
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoomController(req, res, next) {
  const code = req.params.code.trim().toUpperCase();

  if (!/^[A-Z0-9]{6,8}$/.test(code)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_ROOM_CODE",
      message: "Invalid room code",
    });
  }

  try {
    const room = await getRoomForMember({
      userId: req.session.userId,
      code,
    });

    return res.status(200).json({
      status: "success",
      data: { room },
    });
  } catch (error) {
    next(error);
  }
}

export async function listRoomMembersController(req, res, next) {
  const code = req.params.code.trim().toUpperCase();

  if (!/^[A-Z0-9]{6,8}$/.test(code)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_ROOM_CODE",
      message: "Invalid room code",
    });
  }

  try {
    const members = await listRoomMembers({
      userId: req.session.userId,
      code,
    });

    return res.status(200).json({
      status: "success",
      data: { members },
    });
  } catch (error) {
    next(error);
  }
}