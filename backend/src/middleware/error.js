const Errorhandler = require('../utils/errorhander'); // Custom Error Handler

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    // Wrong MongoDB ID Error
    if (err.name === "CastError") {
        const message = `Resource not found, Invalid: ${err.path}`;
        err = new Errorhandler(message, 400);
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new Errorhandler(message, 400);
    }

    // Wrong JWT Error
    if (err.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid, try again`;
        err = new Errorhandler(message, 400);
    }

    // JWT Expired Error (Corrected)
    if (err.name === "TokenExpiredError") {
        const message = `JSON Web Token is expired, try again`;
        err = new Errorhandler(message, 400);
    }

    // Final Failsafe for Undefined Status Codes
    if (!Number.isInteger(err.statusCode)) {
        console.error("Invalid status code detected:", err.statusCode);
        err.statusCode = 500;
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
