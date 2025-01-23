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

//route for signup
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

//route for login

router.post("/login", async (req, res) => {
  const validateInput = schema.safeParse(req.body);
  if (!validateInput.success) {
    return res.status(400).json({ message: validateInput.error.message });
  }
  const { username, password, email } = req.body;

  //match documents where at least one of the specified conditions is true i.e find either with username or email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res.status(403).json({ message: "user does not exist" });
  }
  const isPasswordvalid = await bcrypt.compare(password, user.password);
  if (!isPasswordvalid) {
    return res.status(400).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET);

  return res.status(200).json({ message: "login successful", token });
});

export default router;
