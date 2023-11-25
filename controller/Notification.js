import NotificationModel from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await NotificationModel.find({ userId });
    res.status(200).json(notifications);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getUnreadNotifications = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await NotificationModel.find({ userId });

    const unread = notifications.filter((notification) => !notification.seen);

    res.status(200).json({ unread });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const ReadNotifications = async (req, res) => {
  const { userId, noteId } = req.params;
  try {
    const notification = await NotificationModel.findOne({
      userId: userId,
      _id: noteId,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await notification.updateOne({ $set: { seen: true } });

    res.status(200).json({ notification });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
