export class AppError extends Error {
    constructor(statusCode, message, code) {
        super(message);
// console.log("This is inside AppError: message: ", message)
        console.log("AppError class is thrown");
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}