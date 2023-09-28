import mongoose from "mongoose";

const ProfitDataSchema = mongoose.Schema(
  {
    tradeId: { type: String, required: true },
    price: { type: Number },
    loss: { type: Number },
  },
  { timestamps: true }
);

const ProfitDataModel = mongoose.model("PriceData", ProfitDataSchema);

export default ProfitDataModel;
