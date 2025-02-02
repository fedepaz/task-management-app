import helmet from "helmet";
import cors from "cors";

export const configureSecurityMiddleware = (app: any) => {
  app.use(helmet());

  const allowedOrigins = [
    "http://localhost:3000",
    "https://task-management-app-eight-phi.vercel.app",
    "https://task-management-app-fedepaz-fedepazs-projects.vercel.app",
    "https://task-management-app-git-master-fedepazs-projects.vercel.app",
  ];

  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Set-Cookie"],
  };

  app.use(cors(corsOptions));
  app.set("trust proxy", 1);
};
