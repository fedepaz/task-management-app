import helmet from "helmet";
import cors from "cors";

export const configureSecurityMiddleware = (app: any) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://task-management-app-eight-phi.vercel.app",
    "https://task-management-app-fedepazs-projects.vercel.app",
    "https://task-management-app-fedepaz-fedepazs-projects.vercel.app",
    "https://task-management-app-git-master-fedepazs-projects.vercel.app",
    "https://dist-nu-cyan.vercel.app",
    "https://dist-fedepazs-projects.vercel.app",
    "https://dist-fedepaz-fedepazs-projects.vercel.app",
  ];

  const contentSecurityPolicy = {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", ...allowedOrigins],
      frameSrc: ["'self'", ...allowedOrigins],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      childSrc: ["'self'"],
    },
  };

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: contentSecurityPolicy.directives,
      },
    })
  );

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
