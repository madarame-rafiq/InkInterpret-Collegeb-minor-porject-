import { createRoom } from "../services/roomService.js";
import { createRoomSchema } from "../validators/roomSchemas.js";

export async function createRoomController(req, res, next) {
  const validation = createRoomSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: "error",
      code: "VALIDATION_ERROR",
      message: "Invalid room settings",
      errors: validation.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const room = await createRoom({
      hostUserId: req.session.userId,
      ...validation.data,
    });

    return res.status(201).json({
      status: "success",
      data: { room },
    });
  } catch (error) {
    next(error);
  }
}