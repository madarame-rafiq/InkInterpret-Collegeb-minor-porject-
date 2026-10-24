export const up = (pgm) => {
  pgm.createTable("games", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    room_id: { type: "uuid", notNull: true, references: "rooms", onDelete: "RESTRICT" },
    status: { type: "varchar(16)", notNull: true, default: "active" },
    input_mode: { type: "varchar(10)", notNull: true },
    drawing_duration: { type: "smallint", notNull: true },
    voting_duration: { type: "smallint", notNull: true },
    capture_duration: { type: "smallint", notNull: true, default: 25 },
    current_round_number: { type: "smallint", notNull: true, default: 1 },
    current_phase: { type: "varchar(16)", notNull: true, default: "prompt" },
    phase_ends_at: { type: "timestamptz", notNull: true },
    insufficient_connected_since: { type: "timestamptz" },
    started_at: { type: "timestamptz", notNull: true, default: pgm.func("CURRENT_TIMESTAMP") },
    ended_at: { type: "timestamptz" },
    abort_reason: { type: "varchar(100)" },
  });
  pgm.addConstraint("games", "games_status_check", { check: "status IN ('active', 'finished', 'aborted')" });
  pgm.addConstraint("games", "games_phase_check", { check: "current_phase IN ('prompt', 'drawing', 'capture', 'voting', 'result', 'finished', 'aborted')" });
  pgm.addConstraint("games", "games_capture_duration_check", { check: "capture_duration BETWEEN 15 AND 40" });
  pgm.createIndex("games", ["status", "phase_ends_at"], { name: "games_due_phase_idx" });
  pgm.createIndex("games", "room_id", { name: "games_one_active_room_idx", where: "status = 'active'", unique: true });

  pgm.createTable("game_participants", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    game_id: { type: "uuid", notNull: true, references: "games", onDelete: "CASCADE" },
    user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    roster_position: { type: "smallint", notNull: true },
    score: { type: "integer", notNull: true, default: 0 },
    connected_at: { type: "timestamptz" },
    disconnected_at: { type: "timestamptz" },
  });
  pgm.addConstraint("game_participants", "game_participants_game_user_unique", { unique: ["game_id", "user_id"] });
  pgm.addConstraint("game_participants", "game_participants_position_unique", { unique: ["game_id", "roster_position"] });
  pgm.createIndex("game_participants", ["user_id", "game_id"]);

  pgm.createTable("game_rounds", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    game_id: { type: "uuid", notNull: true, references: "games", onDelete: "CASCADE" },
    round_number: { type: "smallint", notNull: true },
    prompt_giver_user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    prompt_author_user_id: { type: "uuid", references: "users", onDelete: "RESTRICT" },
    prompt_text: { type: "varchar(500)" },
    prompt_status: { type: "varchar(16)", notNull: true, default: "pending" },
    prompt_deadline: { type: "timestamptz", notNull: true },
    voting_skipped: { type: "boolean", notNull: true, default: false },
    voting_skip_reason: { type: "varchar(50)" },
    result_processed: { type: "boolean", notNull: true, default: false },
  });
  pgm.addConstraint("game_rounds", "game_rounds_game_number_unique", { unique: ["game_id", "round_number"] });
  pgm.addConstraint("game_rounds", "game_rounds_prompt_status_check", { check: "prompt_status IN ('pending', 'submitted', 'missed')" });

  pgm.createTable("game_drawings", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    round_id: { type: "uuid", notNull: true, references: "game_rounds", onDelete: "CASCADE" },
    artist_user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    public_id: { type: "uuid", notNull: true, unique: true, default: pgm.func("gen_random_uuid()") },
    submission_type: { type: "varchar(10)", notNull: true },
    canvas_data: { type: "text" },
    storage_key: { type: "varchar(255)" },
    mime_type: { type: "varchar(100)" },
    byte_size: { type: "integer" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("CURRENT_TIMESTAMP") },
  });
  pgm.addConstraint("game_drawings", "game_drawings_round_artist_unique", { unique: ["round_id", "artist_user_id"] });
  pgm.addConstraint("game_drawings", "game_drawings_type_check", { check: "submission_type IN ('canvas', 'photo')" });

  pgm.createTable("game_votes", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    round_id: { type: "uuid", notNull: true, references: "game_rounds", onDelete: "CASCADE" },
    voter_user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    drawing_id: { type: "uuid", notNull: true, references: "game_drawings", onDelete: "RESTRICT" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("CURRENT_TIMESTAMP") },
  });
  pgm.addConstraint("game_votes", "game_votes_round_voter_unique", { unique: ["round_id", "voter_user_id"] });

  pgm.createTable("game_score_events", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    game_id: { type: "uuid", notNull: true, references: "games", onDelete: "CASCADE" },
    round_id: { type: "uuid", notNull: true, references: "game_rounds", onDelete: "CASCADE" },
    user_id: { type: "uuid", notNull: true, references: "users", onDelete: "RESTRICT" },
    event_type: { type: "varchar(32)", notNull: true },
    points: { type: "integer", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("CURRENT_TIMESTAMP") },
  });
  pgm.addConstraint("game_score_events", "game_score_events_once", { unique: ["round_id", "user_id", "event_type"] });
  pgm.addConstraint("game_score_events", "game_score_events_type_check", { check: "event_type = 'non_voting_penalty'" });
};

export const down = (pgm) => {
  pgm.dropTable("game_score_events");
  pgm.dropTable("game_votes");
  pgm.dropTable("game_drawings");
  pgm.dropTable("game_rounds");
  pgm.dropTable("game_participants");
  pgm.dropTable("games");
};
