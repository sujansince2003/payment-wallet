import { Router } from "express";
import mongoose from "mongoose";
import { User } from "../models/User.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
console.log(process.env.JWT_SECRET);
const schema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

router.post("/signup", async (req, res) => {
  const validateInput = schema.safeParse(req.body);
  if (!validateInput.success) {
    return res.status(400).json({ message: validateInput.error.message });
  }
  const { email, username, password } = validateInput.data;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(403).json({ message: "user already exist" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const user = new User({ email, username, password: hashPassword });
    await user.save();
    const jwtToken = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET
    );
    return res
      .status(201)
      .json({ message: "user created successfully", token: jwtToken, user });
  } catch (error) {
    console.log("e1", error);
  }
});

export default router;
