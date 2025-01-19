import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined");
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected");
  } catch (error) {
    console.log("error connecting database", error.message);
  }
};
