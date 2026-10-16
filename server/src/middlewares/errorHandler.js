export const errorHandler = (err, req, res, next) => {
    // Log only the error that are not operational that is some error or bug in the application.
    if (!err.isOperational) {
        console.log("Error: ", err);
    }

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: "error",
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: statusCode === 500 ? 'internal server errror' : err.message,
    });
}