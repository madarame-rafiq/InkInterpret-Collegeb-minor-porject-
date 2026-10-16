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
    pgm.createTable('users', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        username: {
            type: 'varchar(30)',
            notNull: true,
            unique: true,
        },
        password_hash: {
            type: 'varchar(255)',
            notNull: true,
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        }
    });
}

export const down = (pgm) => {
    pgm.dropTable('users');
}