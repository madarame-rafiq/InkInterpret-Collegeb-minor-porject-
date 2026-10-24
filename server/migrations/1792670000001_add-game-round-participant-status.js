export const up = (pgm) => {
  pgm.createTable("game_round_participants", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    round_id: { type: "uuid", notNull: true, references: "game_rounds", onDelete: "CASCADE" },
    user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    drawing_status: { type: "varchar(16)", notNull: true, default: "pending" },
    voted_at: { type: "timestamptz" },
  });
  pgm.addConstraint("game_round_participants", "game_round_participants_unique", { unique: ["round_id", "user_id"] });
  pgm.addConstraint("game_round_participants", "game_round_participants_drawing_status_check", { check: "drawing_status IN ('pending', 'submitted', 'missing')" });
};

export const down = (pgm) => pgm.dropTable("game_round_participants");
