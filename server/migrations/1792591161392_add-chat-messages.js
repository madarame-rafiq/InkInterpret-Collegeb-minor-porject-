
/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
export const up = (pgm) => {
  pgm.createTable("chat_messages", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    room_id: {
      type: "uuid",
      notNull: true,
      references: "rooms",
      onDelete: "CASCADE",
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    content: {
      type: "varchar(1000)",
      notNull: true,
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("clock_timestamp()"),
    },
  });

  pgm.addConstraint("chat_messages", "chat_messages_content_not_empty", {
    check: "length(trim(content)) > 0",
  });

  pgm.createIndex(
    "chat_messages",
    ["room_id", "created_at", "id"],
    {
      name: "chat_messages_room_history_idx",
    }
  );
};

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
export const down = (pgm) => {
  pgm.dropTable("chat_messages");
};
