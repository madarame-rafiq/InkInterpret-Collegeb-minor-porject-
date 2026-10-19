import { leaveRoom } from "../services/leaveRoomService.js";

export async function leaveRoomController(req, res, next) {
  const code = req.params.code.trim().toUpperCase();

  if (!/^[A-Z0-9]{6,8}$/.test(code)) {
    return res.status(400).json({
      status: "error",
      code: "INVALID_ROOM_CODE",
      message: "Invalid room code",
    });
  }

  try {
    const result = await leaveRoom({
      userId: req.session.userId,
      code,
    });

    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}