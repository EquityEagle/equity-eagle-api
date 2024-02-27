import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: Object },
    seen: { type: Boolean },
    text: { type: String, required: true },
    hasIcon: { type: Boolean, default: false },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notifications", NotificationSchema);

export default NotificationModel;
