import CommentsModel from "../models/CommentModel.js";
import NotificationModel from "../models/Notification.js";
import SetupModel from "../models/SetupModel.js";
import UserModel from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

export const PublishSetup = async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, image, video } = req.body;
    const user = await UserModel.findById(userId);

    if (!text || (!image && !video)) {
      return res
        .status(400)
        .json("Text and either an image or video are required");
    }

    let media;
    if (image) {
      media = await cloudinary.uploader.upload(image, {
        upload_preset: "EQUITY_EAGLE",
      });
    } else {
      media = await cloudinary.uploader.upload_large(video, {
        resource_type: "video",
        chunk_size: 6000000,
        upload_preset: "EQUITY_EAGLE",
      });
    }

    const newSetup = new SetupModel({
      userId: userId,
      username: user.username,
      profile: user.username,
      text: text,
    });

    if (image) {
      newSetup.image = media;
    } else {
      newSetup.video = media;
    }

    const publishedSetup = await newSetup.save();
    res.status(201).json(publishedSetup);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getAllSetup = async (req, res) => {
  try {
    const setups = await SetupModel.find();
    if (!setups) return res.status(404).json("No setups avaliable");
    res.status(200).json(setups);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getSetup = async (req, res) => {
  try {
    const { setupId } = req.params;
    const setup = await SetupModel.findById(setupId);
    res.status(200).json(setup);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const LikeSetup = async (req, res) => {
  try {
    const { setupId } = req.params;
    const { userId } = req.params;
    const setup = await SetupModel.findById(setupId);
    const sUser = await UserModel.findById(setup.userId);
    const likedUser = await UserModel.findById(userId);

    if (!setup) {
      return res.status(404).json({ error: "Setup not found" });
    }

    const LikeSetup = new NotificationModel({
      userId: setup.userId,
      image: likedUser.profile,
      body: `${likedUser.username} Liked your setup`,
      seen: false,
    });

    if (setup.likes.includes(userId)) {
      // If the user's ID is already in the likes array, remove it (unlike)
      await setup.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Setup-Unliked");
    } else {
      // If the user's ID is not in the likes array, add it (like)
      const savednotification = await LikeSetup.save();
      await setup.updateOne({ $push: { likes: userId } });
      await sUser.updateOne({ $push: { notification: savednotification } });
      res.status(200).json("Setup-Liked");
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const CommentOnSetup = async (req, res) => {
  try {
    const { setupId } = req.params;
    const { userId } = req.params;
    const { image, body } = req.body;
    const setup = await SetupModel.findById(setupId);
    const user = await UserModel.findById(userId);
    if (image) {
      const UploadRes = cloudinary.uploader.upload(image, {
        upload_preset: "EQUITY_EAGLE",
      });

      const comments = new CommentsModel({
        userId: userId,
        username: user.username,
        profile: user.profile,
        body: body,
        image: UploadRes,
      });

      const commentsetup = await comments.save();
      await setup.updateOne({ $push: { comments: commentsetup } });
    } else {
      const comments = new CommentsModel({
        userId: userId,
        username: user.username,
        profile: user.profile,
        body: body,
      });

      const commentsetup = await comments.save();
      await setup.updateOne({ $push: { comments: commentsetup } });
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
