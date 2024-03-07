import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    profile: { type: Object },
    community: { type: Array, default: [] },
    ideas: { type: Array, default: [] },
    accounts: { type: Array, default: [] },
    networks: { type: Array, default: [] },
    notification: { type: Array, default: [] },
    verified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    ideaPrivacy: { type: String, default: "public" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
