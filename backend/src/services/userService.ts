import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import Error from "../models/Error";
import {
  LoginCredentialsSchema,
  RegisterCredentialsSchema,
} from "@task-app/shared/dist/validation/auth";
import {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from "@task-app/shared/dist/types/auth";

export class UserService {
  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    const validatedData = RegisterCredentialsSchema.parse(credentials);

    const existingUser = await UserModel.findOne({
      email: validatedData.email,
    });
    if (existingUser) {
      throw new Error({
        message: "User already exists",
        statusCode: 422,
      });
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
      throw new Error({ message: "User not found", statusCode: 404 });
    }

    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new Error({
        message: "The user or password is incorrect",
        statusCode: 401,
      });
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
      throw new Error({
        message: "Failed to validate session",
        statusCode: 401,
      });
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        $set: { refreshToken: null },
      });

      return true;
    } catch (error) {
      throw new Error({
        message: "Failed to logout",
        statusCode: 400,
      });
    }
  }
}

/**
 * still having problems...

it could be on the frontend hook the problem?

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["session"], {
        authenticated: false,
        user: null,
      });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate("/login");
    },
  });


because i added logs to the controller on the back


  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    console.log("Logging out");
    const token = req.cookies.access_token;

    const decoded = jwt.verify(token, SECRET) as {
      userId: string;
      name: string;
    };
    const result = await this.userService.logout(decoded.userId);
    console.log("Result", result);
    if (result) {
      return res.status(200).json({
        message: "User logged out successfully",
      });
    }
  };

and it's responding ok... but on the clientside the 


 */
