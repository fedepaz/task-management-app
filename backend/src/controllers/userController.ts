import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET as string;

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.register(req.body);

      res.status(201).json({
        message: "User registered successfully",
        user,
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
          sameSite: "none",
          secure: true,
        })
        .send({ user, token });
    } catch (error) {
      next(error);
    }
  };
}
