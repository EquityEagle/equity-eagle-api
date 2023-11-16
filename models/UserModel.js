import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    profile: { type: Object },
    channels: { type: Array, default: [] },
    setups: { type: Array, default: [] },
    accounts: { type: Array, default: [] },
    notification: { type: Array, default: [] },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
