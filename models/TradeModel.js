import mongoose from "mongoose";

const TradeSchema = mongoose.Schema(
  {
    symbol: { type: String, required: true },
    type: { type: String, required: true },
    profit: { type: Number },
    loss: { type: Number },
    lotSize: { type: Number, required: true },
    entrysty: { type: String },
    exitsty: { type: String },
    why: { type: String },
    status: { type: String, required: true },
    setup: { type: Object },
    rate: { type: Number, default: 0 },
    comments: { type: String },
  },
  { timestamps: true }
);

const TradeModel = mongoose.model("Trade", TradeSchema);

export default TradeModel;
