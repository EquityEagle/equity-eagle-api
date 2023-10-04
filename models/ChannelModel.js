import mongoose from "mongoose";

const CommunitySchema = mongoose.Schema(
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

const CommunityModel = mongoose.model("Channel", CommunitySchema);

export default CommunityModel;
