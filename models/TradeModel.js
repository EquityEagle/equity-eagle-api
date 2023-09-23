import mongoose from "mongoose";

const TradeSchema = mongoose.Schema(
  {
    currency: { type: String, required: true },
    symbol: { type: String, required: true },
    type: { type: String, required: true },
    profit: { type: Number },
    loss: { type: Number },
    lotSize: { type: Number, required: true },
    reason: { type: String },
    why: { type: String, required: true },
    status: { type: String, required: true },
    setup: { type: Array, default: [] },
  },
  { timestamps: true }
);

const TradeModel = mongoose.model("Trade", TradeSchema);

export default TradeModel;
