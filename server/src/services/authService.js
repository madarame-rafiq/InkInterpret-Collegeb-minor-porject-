import bcrypt from 'bcrypt';
import { AppError } from '../utils/AppError.js';
import { createUser } from '../database/queries/users.js';

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