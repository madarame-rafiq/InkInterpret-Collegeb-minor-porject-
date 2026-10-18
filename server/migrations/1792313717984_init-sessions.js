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
    pgm.createTable('user_sessions', {
        sid: {
            type: "varchar",
            primaryKey: true
        },
        sess: {
            type: "json",
            notNull: true
        },
        expire: {
            type: "timestamptz",
            notNull: true
        }
    });

    pgm.createIndex("user_sessions", "expire");
}

export const down = (pgm) => {
    pgm.dropTable("user_sessions");
}