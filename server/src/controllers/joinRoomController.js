import { joinRoom } from "../services/joinRoomService.js";
import { joinRoomSchema } from "../validators/joinRoomSchema.js";

export async function joinRoomController(req, res, next) {
  const validation = joinRoomSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Invalid room code",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const room = await joinRoom({
      userId: req.session.userId,
      code: validation.data.code,
    });

    return res.status(200).json({
      status: "success",
      data: { room },
    });
  } catch (error) {
    next(error);
  }
}