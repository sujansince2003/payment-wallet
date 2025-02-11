import { Router } from "express";
import mongoose from "mongoose";
import { Account } from "../models/account.model.js";
import authMiddlware from "./middlewares/auth.middleware.js";
import { z } from "zod";
const router = Router();

const transferSchema = z.object({
  receiverID: z.string(),
  amount: z.number(),
});
router.get("/", authMiddlware, async (req, res) => {
  const accounts = await Account.find().populate("userID");
  return res.status(200).json({ accounts });
});

router.get("/getUserAccountInfo", authMiddlware, async (req, res) => {
  const userID = req.userID;

  try {
    // Find the user's account and populate the user data
    const account = await Account.findOne({ userID })
      .populate("userID") // Populating the user reference in the Account model
      .exec();

    if (!account) {
      return res.status(400).json({ msg: "Account not found for this user" });
    }

    return res.status(200).json({
      account: account, // The account info
      // user: account.userID, // The populated user info
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/getbalance", authMiddlware, async (req, res) => {
  const userID = req.userID;
  const account = await Account.findOne({ userID });

  if (!account) {
    return res.status(400).json({ msg: "invalid user id" });
  }
  return res.status(200).json({ balance: account.balance, userID });
});

router.post("/transfer", authMiddlware, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // This starts a new session for the database operations.
    session.startTransaction();
    const userID = req.userID;
    const fromaccount = await Account.findOne({ userID }).session(session);

    if (!fromaccount) {
      await session.abortTransaction();
      return res.status(400).json({ msg: "user doesnot exist" });
    }

    const { receiverID, amount } = req.body;
    const validateInput = transferSchema.safeParse({ receiverID, amount });
    if (!validateInput.success) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({ msg: validateInput.error.message });
    }
    if (fromaccount.balance < amount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({ msg: "insufficient balance" });
    }

    const toaccount = await Account.findOne({ userID: receiverID }).session(
      session
    );
    if (!toaccount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(400).json({ msg: "receiver doesnot exist" });
    }

    //deduct balance from sender
    await Account.updateOne(
      { userID },
      {
        $inc: {
          balance: -amount,
        },
      },
      { session }
    );

    //add balance to receiver
    await Account.updateOne(
      {
        userID: receiverID,
      },
      {
        $inc: {
          balance: amount,
        },
      },
      { session }
    );
    await session.commitTransaction();
    await session.endSession();
    return res
      .status(200)
      .json({ msg: "transfer successful", fromaccount, toaccount });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      await session.endSession();
    }

    return res.status(500).json({ msg: error.message });
  }
});

export default router;
