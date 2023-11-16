import mongoose from "mongoose";

const TradeSchema = mongoose.Schema(
  {
    symbol: { type: String, required: true },
    type: { type: String, required: true },
    profit: { type: Number },
    profitData: { type: Array, default: [] },
    loss: { type: Number },
    lotSize: { type: Number, required: true },
    reason: { type: String },
    why: { type: String },
    status: { type: String, required: true },
    setup: { type: Array, default: [] },
    rate: { type: Number, default: 0 },
    confluence: { type: Array, default: [] },
  },
  { timestamps: true }
);

const TradeModel = mongoose.model("Trade", TradeSchema);

export default TradeModel;
