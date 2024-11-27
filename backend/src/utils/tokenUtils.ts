import jwt from "jsonwebtoken";
import { User } from "@task-app/shared/src/types/user";

export function generateAccessToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
}

export function generateRefreshToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyAccessToken(token: string): User {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as User;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export function verifyRefreshToken(token: string): {
  id: string;
  email: string;
} {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
      id: string;
      email: string;
    };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
}
