import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserService } from "../services/userService";

dotenv.config();

const SECRET = process.env.JWT_SECRET as string;

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  loggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const token = req.cookies.access_token;

      if (!token) {
        return res.status(401).json({
          authenticated: false,
          message: "No authentication token found",
        });
      }

      try {
        const decoded = jwt.verify(token, SECRET) as {
          userId: string;
          name: string;
        };

        const user = await this.userService.validateSession(decoded.userId);

        if (!user) {
          return res.status(401).json({
            authenticated: false,
            message: "User not found",
          });
        }
        return res.status(200).json({
          authenticated: true,
          user,
        });
      } catch (tokenError) {
        return res.status(401).json({
          authenticated: false,
          message: "Invalid or expired token",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const token = req.cookies.access_token;
      if (!token) {
        return res.status(401).json({
          authenticated: false,
          message: "No authentication token found",
        });
      }

      try {
        const decoded = jwt.verify(token, SECRET) as {
          userId: string;
          name: string;
        };
        if (await this.userService.logout(decoded.userId)) {
          res.clearCookie("access_token", {
            httpOnly: true,
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
            path: "/",
          });
          res.cookie("access_token", "", {
            httpOnly: true,
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
            expires: new Date(0),
            path: "/",
          });
          res.end();
        }
      } catch (tokenError) {
        return res.status(401).json({
          authenticated: false,
          message: "Invalid or expired token",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
