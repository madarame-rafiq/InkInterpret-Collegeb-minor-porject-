// A completed game returns its room to waiting. Permit the existing empty-room
// deletion path to remove that historical game graph; the service deletes its
// local photo files after this database transaction commits.
export const up = (pgm) => {
  pgm.dropConstraint("games", "games_room_id_fkey");
  pgm.addConstraint("games", "games_room_id_fkey", {
    foreignKeys: {
      columns: "room_id",
      references: "rooms(id)",
      onDelete: "CASCADE",
    },
  });
};

export const down = (pgm) => {
  pgm.dropConstraint("games", "games_room_id_fkey");
  pgm.addConstraint("games", "games_room_id_fkey", {
    foreignKeys: {
      columns: "room_id",
      references: "rooms(id)",
      onDelete: "RESTRICT",
    },
  });
};
