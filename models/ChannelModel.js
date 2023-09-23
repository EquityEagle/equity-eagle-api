import mongoose from "mongoose";

const ChannleSchema = mongoose.Schema(
  {
    ownerId: { type: String, required: true },
    ownername: { type: String, required: true },
    ownerProfile: { type: String },
    name: { type: String, required: true },
    profile: { type: Object },
    members: { type: Array, default: [] },
    chats: { type: Array, default: [] },
    slug: { type: String, required: true },
  },
  { timestamps: true }
);

const ChannleModel = mongoose.model("Channel", ChannleSchema);

export default ChannleModel;
