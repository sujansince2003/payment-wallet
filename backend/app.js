import express from "express";
import cors from "cors";
import UserRoutes from "./routes/user.route.js";
import accountRoutes from "./routes/account.route.js";

import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

app.use(cookieParser());
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/account", accountRoutes);
export default app;
