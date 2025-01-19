import helmet from "helmet";
import cors from "cors";

export const configureSecurityMiddleware = (app: any) => {
  app.use(helmet());

  const allowedOrigins = ["http://localhost:5173"];

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
  /// corsP
  app.use(cors(corsOptions));
};
