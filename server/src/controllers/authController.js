import { loginUser, registerUser } from "../services/authService.js";
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

        res.status(200).json({
            status: "success",
            data: { user },
        });
    } catch (error) {
        next(error);
    }
}