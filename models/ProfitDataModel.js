import mongoose from "mongoose";

const ProfitDataSchema = mongoose.Schema(
  {
    tradeId: { type: String, required: true },
    profit: { type: Number },
    loss: { type: Number },
  },
  { timestamps: true }
);

const ProfitDataModel = mongoose.model("ProfitData", ProfitDataSchema);

export default ProfitDataModel;
