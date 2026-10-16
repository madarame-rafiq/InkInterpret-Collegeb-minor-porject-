import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError.js';
import { createUser, findUserByUsername } from '../database/queries/users.js';

export const registerUser = async ({ username, password }) => {
    const passwordHash = await bcrypt.hash(password, 12);
    // console.log("Inside registration service usrrname and password: ", username, password);

    try {
        return await createUser({username, passwordHash});
    } catch (error) {
        if (error.code = "23505") {
            throw new AppError(409, 'username is already taken', 'USERNAME_TAKEN');
        }
        throw Error;
    }
}

export const loginUser = async ({ username, password }) => {
    const user = await findUserByUsername(username);
    // console.log("in login service");

    if (!user) {
        // console.log("user not found");
        throw new AppError(400, 'Invalid username or password', "INVALID_CREDENTIALS");
    }
    // console.log("user found");

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
        throw new AppError(400, 'Invalid username or password', "INVALID_CREDENTIALS");
    }

    return {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
    }
}