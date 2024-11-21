import helmet from "helmet";
import cors from "cors";

export const configureSecurityMiddleware = (app: any) => {
  app.use(helmet());

  const allowedOrigins = ["", "", "", "", ""];

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
  };
  app.use(cors(corsOptions));
};
