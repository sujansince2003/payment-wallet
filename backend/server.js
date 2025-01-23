import { connectDB } from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({});

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("connection failed", error.message);
  });
