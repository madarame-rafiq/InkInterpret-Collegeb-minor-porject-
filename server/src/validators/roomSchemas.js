import { z } from "zod";

export const createRoomSchema = z.object({
  maxPlayers: z.number().int().min(3).max(10).default(6),

  drawingDuration: z
    .number()
    .int()
    .min(30)
    .max(180)
    .refine((value) => value % 15 === 0, {
      message: "Drawing duration must be in increments of 15 seconds",
    })
    .default(60),

  votingDuration: z.number().int().min(15).max(90).default(30),

  inputMode: z.enum(["canvas", "photo"]).default("canvas"),
});