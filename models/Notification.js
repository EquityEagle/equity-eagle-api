import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: Object },
    seen: { type: Boolean },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notifications", NotificationSchema);

export default NotificationModel;
