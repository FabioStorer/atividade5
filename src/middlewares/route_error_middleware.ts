import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Object.setPrototypeOf(this, new.target.prototype);

        Error.captureStackTrace(this);
    }
};

export const routeErrorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    console.error("Error:", err instanceof AppError ? err.message : "Internal Server Error");

    const statusCode = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : "Internal Server Error";

    res.status(statusCode).json({
        status: "error",
        message
    });
};