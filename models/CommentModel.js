import mongoose from "mongoose";

const CommentsSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    profile: { type: Object },
    username: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: Object },
    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
  },
  { timestamps: true }
);

const CommentsModel = mongoose.model("Comments", CommentsSchema);

export default CommentsModel;
