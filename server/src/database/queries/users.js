import { pool } from "../pool.js"


export const findUserByUsername = async (username) => {
    const result = await pool.query(`
            SELECT id, username, password_hash, created_at
            FROM users
            WHERE username = $1
        `, [username]);

    return result.rows[0] ?? null;
}

export const createUser = async ({ username, passwordHash }) => {
    const result = await pool.query(`
            INSERT INTO users (username, password_hash)
            VALUES ($1, $2)
            RETURNING id, username, created_at
        `, [username, passwordHash]);

    return result.rows[0];
}