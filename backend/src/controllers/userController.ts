import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET as string;

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.register(req.body);

      const token = jwt.sign({ name: user.name, userId: user.id }, SECRET, {
        expiresIn: "1d",
      });

      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 86400000,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        })
        .status(201)
        .json({
          user,
          token,
        });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.login(req.body);

      const token = jwt.sign({ name: user.name, userId: user.id }, SECRET, {
        expiresIn: "24h",
      });

      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 86400000,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
        })
        .status(200)
        .json({ user, token });
    } catch (error) {
      next(error);
    }
  };
}
