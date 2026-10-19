export const up = (pgm) => {
  pgm.createTable("room_members", {
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

    role: {
      type: "varchar(10)",
      notNull: true,
      default: "player",
    },

    joined_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint("room_members", "room_members_role_check", {
    check: "role IN ('host', 'player')",
  });

  pgm.addConstraint("room_members", "room_members_room_user_unique", {
    unique: ["room_id", "user_id"],
  });

  pgm.createIndex("room_members", "user_id");
};

export const down = (pgm) => {
  pgm.dropTable("room_members");
};