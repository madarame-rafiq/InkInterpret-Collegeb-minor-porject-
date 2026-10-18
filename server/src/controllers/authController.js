import { findUserById } from "../database/queries/users.js";
import { loginUser, registerUser } from "../services/authService.js";
import { AppError } from "../utils/AppError.js";
import { loginSchema, registerSchema } from "../validators/authSchema.js"


export const register = async (req, res, next) => {
    try {
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                code: "VALIDATION_ERROR",
                message: validation.error.issues[0].message,
            });
        }

        const user = await registerUser(validation.data);

        return res.status(201).json({
            status: "success",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
} 


export const login = async (req, res, next) => {
    try {
        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                code: ":VALIDATION_ERROR",
                message: validation.error.issues[0].message
            });
        }
        // console.log("In login controller");

        const user = await loginUser(validation.data);

        req.session.userId = user.id;

        req.session.save((error) => {
        if (error) {
            return next(error);
        }

        return res.status(200).json({
            status: "success",
            data: { user },
        });
        });
    } catch (error) {
        next(error);
    }
}

export const getMe = async (req, res, next) => {
    try {
        const user = await findUserById(req.session?.userId);

        if (!user) {
            req.session.destroy(() => {});
            return next(
                new AppError(401, 'Authentication required', "UNAUTHORIZED")
            );
        }
        res.status(200).json({
            status: "success",
            data: { user }
        });
    } catch (error) {
        next(error)
    }
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie("inkinterpret.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  });
}