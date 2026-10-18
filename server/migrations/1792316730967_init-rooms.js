// /**
//  * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
//  */
// export const shorthands = undefined;

// /**
//  * @param pgm {import('node-pg-migrate').MigrationBuilder}
//  * @param run {() => void | undefined}
//  * @returns {Promise<void> | void}
//  */
// export const up = (pgm) => {};

// /**
//  * @param pgm {import('node-pg-migrate').MigrationBuilder}
//  * @param run {() => void | undefined}
//  * @returns {Promise<void> | void}
//  */
// export const down = (pgm) => {};


export const up = (pgm) => {
  pgm.createTable("rooms", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    code: {
      type: "varchar(8)",
      notNull: true,
      unique: true,
    },

    host_user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "RESTRICT",
    },

    max_players: {
      type: "smallint",
      notNull: true,
      default: 6,
    },

    drawing_duration: {
      type: "smallint",
      notNull: true,
      default: 60,
    },

    voting_duration: {
      type: "smallint",
      notNull: true,
      default: 30,
    },

    input_mode: {
      type: "varchar(10)",
      notNull: true,
      default: "canvas",
    },

    status: {
      type: "varchar(20)",
      notNull: true,
      default: "waiting",
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("rooms", "rooms_code_format_check", {
    check: "code ~ '^[A-Z0-9]{6,8}$'",
  });

  pgm.addConstraint("rooms", "rooms_max_players_check", {
    check: "max_players BETWEEN 3 AND 10",
  });

  pgm.addConstraint("rooms", "rooms_drawing_duration_check", {
    check: "drawing_duration BETWEEN 30 AND 180 AND drawing_duration % 15 = 0",
  });

  pgm.addConstraint("rooms", "rooms_voting_duration_check", {
    check: "voting_duration BETWEEN 15 AND 90",
  });

  pgm.addConstraint("rooms", "rooms_input_mode_check", {
    check: "input_mode IN ('canvas', 'photo')",
  });

  pgm.addConstraint("rooms", "rooms_status_check", {
    check: "status IN ('waiting', 'in_progress', 'finished', 'closed')",
  });

  pgm.createIndex("rooms", "host_user_id");
  pgm.createIndex("rooms", "status");
};

export const down = (pgm) => {
  pgm.dropTable("rooms");
};
