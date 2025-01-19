import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import { env } from "./config/env.js";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: env.CORS_ORIGIN || "http://localhost:3000",
  })
);

app.use(cookieParser());

export default app;
