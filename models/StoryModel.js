import mongoose from "mongoose";

const StoryScheme = mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    profile: { type: Object },
    story: { type: Array, default: [] },
  },
  { timestamps: true }
);

const StoryModel = mongoose.model("Story", StoryScheme);

export default StoryModel;
