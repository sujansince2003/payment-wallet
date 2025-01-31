import { Router } from "express";
import { User } from "../models/User.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddlware from "./middlewares/auth.middleware.js";

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
      { username: user.username, userID: user._id },
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

  const token = jwt.sign(
    { username: user.username, userID: user._id },
    process.env.JWT_SECRET
  );

  return res.status(200).json({ message: "login successful", user, token });
});

//route to  update user details

router.put("/update", authMiddlware, async (req, res) => {
  const validateInput = schema.safeParse(req.body);
  if (!validateInput.success) {
    return res.status(400).json({ message: "invalid input" });
  }
  const { email, username, password } = req.body;
  if (!req.userID) {
    return res
      .status(400)
      .json({ message: "Unauthorized:UserID not provided" });
  }
  const user = await User.findOne({
    _id: req.userID,
  });
  if (!user) {
    return res.status(403).json({ message: "user doesnot exist" });
  }

  const updateData = {};
  if (username) updateData.username = username;
  if (email) updateData.email = email;
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const updateUser = await User.findOneAndUpdate(
    {
      _id: req.userID,
    },
    updateData,
    { new: true }
  );
  updateUser
    ? res.status(200).json({ message: "user updated successfully", updateUser })
    : res.status(400).json({ message: "user not updated" });
});

//route to filter
router.get("/filter", async (req, res) => {
  const searchQuery = req.query;

  const searchSchema = z.object({
    fname: z.string().optional(),
    email: z.string().email().optional(),
  });
  const validateSearchParams = searchSchema.safeParse(searchQuery);
  if (!validateSearchParams.success) {
    return res.status(400).json({ message: "invalid  search input" });
  }
  const { fname, email } = searchQuery;

  const query = {};

  if (fname) {
    query.username = { $regex: fname, $options: "i" };
  }
  if (email) {
    query.email = { $regex: email, $options: "i" };
  }

  const users = await User.find(query);

  if (users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }

  return res.status(200).json({
    users,
  });
});

export default router;
