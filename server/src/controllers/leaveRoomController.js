import { leaveRoom } from "../services/leaveRoomService.js";
import { removeDrawingFiles } from "../services/gameService.js";
import { revokeUserFromRoom } from "../socket/index.js";

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
    const userId = req.session.userId;

    const result = await leaveRoom({ userId, code });

    // The DB transaction has committed. Only now do we revoke live access.
    // Failures here must not fail the HTTP response — the leave is already
    // persisted and cannot be rolled back.
    if (result.roomId) {
      try {
        const io = req.app.get("io");
        await revokeUserFromRoom(io, result.roomId, userId, {
          roomDeleted: result.deleted,
        });
      } catch (revokeError) {
        console.error(
          "Failed to revoke socket access after successful leave:",
          revokeError
        );
      }
    }

    // Files are deliberately removed only after the transaction deleted the
    // room and cascaded its game rows. A cleanup failure cannot resurrect DB
    // state or turn a completed leave into an HTTP error.
    if (result.deleted) await removeDrawingFiles(result.drawingStorageKeys);
    const { drawingStorageKeys, ...response } = result;

    return res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}
