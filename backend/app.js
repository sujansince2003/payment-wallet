import express from "express";
import cors from "cors";
import Userroutes from "./routes/user.route.js";

import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

app.use(cookieParser());
app.use("/api/v1/user", Userroutes);
export default app;
