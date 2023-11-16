import mongoose from "mongoose";

const AccountMetrixSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    accounttype: { type: String, required: true },
    accountsize: { type: Number, required: true },
    trades: { type: Array, default: [] },
    lots: { type: Number },
    winRate: { type: Number },
    profitdata: { type: Array, default: [] },
  },
  { timestamps: true }
);

const AccountMetrixModal = mongoose.model("AccountMetrix", AccountMetrixSchema);

export default AccountMetrixModal;
