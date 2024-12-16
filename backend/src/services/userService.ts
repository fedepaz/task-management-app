import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import {
  LoginCredentialsSchema,
  RegisterCredentialsSchema,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "@task-app/shared";

export class UserService {
  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    const validatedData = RegisterCredentialsSchema.parse(credentials);

    const existingUser = await UserModel.findOne({
      email: validatedData.email,
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    const newUser = new UserModel({
      email: validatedData.email,
      name: validatedData.name,
      role: "USER",
      passwordHash,
    });

    await newUser.save();

    return {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const validatedData = LoginCredentialsSchema.parse(credentials);

    const user = await UserModel.findOne({ email: validatedData.email });
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async validateSession(userId: string): Promise<AuthUser | null> {
    try {
      const user = await UserModel.findById(userId).select("-passwordHash");

      if (!user) {
        return null;
      }

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      console.error("Session validation error:", error);
      return null;
    }
  }
}
