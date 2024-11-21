import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { configureSecurityMiddleware } from "./middlewares/securityMiddleware";
import taskRoutes from "./routes/taskRoutes";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

configureSecurityMiddleware(app);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/tasks", taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/api`);
});
