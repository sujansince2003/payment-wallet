import express from "express";
import cors from "cors";
import UserRoutes from "./routes/user.route.js";
import accountRoutes from "./routes/account.route.js";

import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.options("*", cors()); //ensures the server properly responds to preflight requests, preventing CORS errors.

app.use(cookieParser());
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/account", accountRoutes);
export default app;
