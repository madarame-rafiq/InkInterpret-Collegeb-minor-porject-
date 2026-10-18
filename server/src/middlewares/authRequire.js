import { AppError } from "../utils/AppError.js";


export const authRequire = (req, res, next) => {
    if (!req.session?.userId) {
        return next(
            new AppError(401, 'Authentication required', "UNAUTHORIZED")
        );
    }
    next();
}