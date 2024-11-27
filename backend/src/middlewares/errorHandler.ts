import { Request, Response, NextFunction } from "express";
import Error from "../models/Error";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = async (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? "Internal Server Error" : err.message;

  try {
    await Error.create({
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      statusCode: statusCode,
    });
  } catch (logError) {
    console.error("Failed to log error to database:", logError);
  }

  res.status(statusCode).json({
    error: {
      message: message,
      status: statusCode,
    },
  });
};

export default errorHandler;
