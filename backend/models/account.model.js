import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
});

const Account = mongoose.model("Account", AccountSchema);

export { Account };
