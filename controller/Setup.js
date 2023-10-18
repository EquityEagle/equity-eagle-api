import CommentsModel from "../models/CommentModel.js";
import NotificationModel from "../models/Notification.js";
import SetupModel from "../models/SetupModel.js";
import UserModel from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

export const PublishSetup = async (req, res) => {
  try {
    const { userId } = req.params;
    const { desc, image, video, pair, type } = req.body;
    const user = await UserModel.findById(userId);

    if (!desc || !image) {
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
      desc: desc,
      pair: pair,
      type: type,
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
    const setups = await SetupModel.find().sort({ createdAt: -1 });
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
    const { userId } = req.params;
    const setup = await SetupModel.findById(setupId);
    if (!setup.views.includes(userId)) {
      await setup.updateOne({ $push: { views: userId } });
    }
    res.status(200).json(setup);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const LikeSetup = async (req, res) => {
  try {
    const { setupId, userId } = req.params;
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

export const StarSetup = async (req, res) => {
  try {
    const { setupId, userId } = req.params;
    const setup = await SetupModel.findById(setupId);
    const star = setup.star;
    if (!star.includes(userId)) {
      await setup.updateOne({ $push: { star: userId } });
      res.status(200).json("Idea stared");
    } else {
      await setup.updateOne({ $pull: { star: userId } });
      res.status(200).json("Idea Unstared");
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const BagSetup = async (req, res) => {
  try {
    const { setupId, userId } = req.params;
    const setup = await SetupModel.findById(setupId);
    const bagged = setup.bagged;
    if (!bagged.includes(userId)) {
      await setup.updateOne({ $push: { bagged: userId } });
      res.status(200).json("Idea bagged");
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
    const { image, desc } = req.body;
    const setup = await SetupModel.findById(setupId);
    const user = await UserModel.findById(userId);
    const owner = await UserModel.findById(setup.userId);
    if (image) {
      const UploadRes = cloudinary.uploader.upload(image, {
        upload_preset: "EQUITY_EAGLE",
      });

      const comments = new CommentsModel({
        userId: userId,
        username: user.username,
        profile: user.profile,
        desc: desc,
        image: UploadRes,
      });

      const commentNotify = new NotificationModel({
        userId: setup.userId,
        image: user.profile,
        body: `${user.username} Commented on your setup`,
        seen: false,
      });

      const commentsetup = await comments.save();
      const notification = await commentNotify.save();
      await setup.updateOne({ $push: { comments: commentsetup } });
      await owner.updateOne({ $push: { notification: notification } });
    } else {
      const comments = new CommentsModel({
        userId: userId,
        username: user.username,
        profile: user.profile,
        desc: desc,
      });

      const commentsetup = await comments.save();
      const notification = await commentNotify.save();
      await setup.updateOne({ $push: { comments: commentsetup } });
      await owner.updateOne({ $push: { notification: notification } });
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getSetupLikes = async (req, res) => {
  try {
    const { setupId } = req.params;
    const setup = await SetupModel.findById(setupId);
    const likes = setup.likes;
    const comments = setup.comments;
    const views = setup.views;
    const bagged = setup.bagged;
    const star = setup.star;
    res.status(200).json({ likes, comments, views, bagged, star });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const LikeSetupComments = async (req, res) => {
  try {
    const { commentsId } = req.params;
    const { userId } = req.params;
    const Comment = await CommentsModel.findById(commentsId);

    if (Comment.likes.includes(userId)) {
      await Comment.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Comment Unliked");
    } else {
      await Comment.updateOne({ $push: { likes: userId } });
      res.status(200).json("Comment Liked");
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getSetupComments = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comments = await CommentsModel.findById(commentId);
    res.status(200).json(comments);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
export const getSetupCommentLikes = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comments = await CommentsModel.findById(commentId);
    const likes = comments.likes;
    res.status(200).json(likes);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
