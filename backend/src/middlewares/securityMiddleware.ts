import helmet from "helmet";
import cors from "cors";

export const configureSecurityMiddleware = (app: any) => {
  app.use(helmet());

  const allowedOrigins = [
    "http://localhost:3000",
    "https://task-management-app.vercel.app",
    "https://task-management-app-fedepazs-projects.vercel.app/",
    "https://task-management-jcfxvujlm-fedepazs-projects.vercel.app/",
    "https://task-management-app-git-master-fedepazs-projects.vercel.app/",
  ];

  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
};
