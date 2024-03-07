import mongoose from "mongoose";

const StoryDetailsScheme = mongoose.Schema(
  {
    text: { type: String },
    img: { type: Object },
    views: { type: Array, default: [] },
  },
  { timestamps: true }
);

const StoryDetailsModel = mongoose.model("StoryDetails", StoryDetailsScheme);

export default StoryDetailsModel;
