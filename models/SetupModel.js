import mongoose from "mongoose";

const SetupSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    pair: { type: String, required: true },
    type: { type: String, required: true },
    desc: { type: String, required: true },
    profile: { type: Object },
    image: { type: Object },
    video: { type: Object },
    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    rates: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const SetupModel = mongoose.model("Setups", SetupSchema);

export default SetupModel;
