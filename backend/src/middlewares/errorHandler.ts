import { Request, Response, NextFunction } from "express";
import Error from "../models/Error";

interface CustomError extends Error {
  statusCode?: number;
  errors: {
    message: string;
  }[];
}

interface ZodError extends Error {
  statusCode?: number;
  name: "ZodError";
  errors: {
    code: string;
    message: string;
  }[];
}

const errorHandler = async (
  err: CustomError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let zodErrorStatusCode = null;
  let zodErrorMessage = null;
  if (err.name === "ZodError") {
    zodErrorStatusCode = err.statusCode = 400;
    zodErrorMessage = err.errors[0].message;
  }

  const statusCode = zodErrorStatusCode || err.statusCode || 500;
  const message =
    statusCode === 500
      ? "Internal Server Error"
      : zodErrorMessage || err.message;

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
