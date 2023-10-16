const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // MongoDB wrong id error handling
    if (err.name === "CastError") {
        const message = `Resource not found. invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // MongoDB duplicate key error handling
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

     // wrong JWT error handling
     if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, please try again`;
        err = new ErrorHandler(message, 400);
    }

     // JWT Expire error handling
     if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is expired, please try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,

    })
};