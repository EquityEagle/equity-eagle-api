import CommentsModel from "../models/CommentModel.js";
import NotificationModel from "../models/Notification.js";
import SetupModel from "../models/SetupModel.js";
import UserModel from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

export const PublishSetup = async (req, res) => {
  try {
    const { userId } = req.params;
    const { desc, image, pair, type } = req.body;
    const user = await UserModel.findById(userId);

    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "EQUITY_EAGLE",
      });
      if (uploadRes) {
        const newSetup = new SetupModel({
          userId: userId,
          username: user.username,
          profile: user.profile,
          desc: desc,
          pair: pair,
          type: type,
          image: uploadRes,
        });

        const publishedSetup = await newSetup.save();
        await user.updateOne({ $push: { ideas: publishedSetup } });

        res.status(201).json(publishedSetup);
      }
    } else {
      return res.status(404).json("Image is required");
    }
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
      body: `${likedUser.name} liked your idea`,
      text: `${setup.desc}`,
      seen: false,
      type: "like",
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
    const owner = await UserModel.findById(setup.userId);

    const starNotify = new NotificationModel({
      userId: setup.userId,
      image: user.profile,
      body: `${user.name} stared your idea`,
      text: `${setup.desc}`,
      seen: false,
      type: "star",
    });

    const notification = await starNotify.save();

    if (!star.includes(userId)) {
      await setup.updateOne({ $push: { star: userId } });
      await owner.updateOne({ $push: { notification: notification } });
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

export const CommentOnSetup = async (req, res) => {
  try {
    const { setupId, userId } = req.params;
    const { image, desc } = req.body;
    const setup = await SetupModel.findById(setupId);
    const user = await UserModel.findById(userId);
    const owner = await UserModel.findById(setup.userId);

    const commentNotify = new NotificationModel({
      userId: setup.userId,
      image: user.profile,
      body: `${user.name} Commented on your idea`,
      text: `${setup.desc}`,
      seen: false,
      type: "comment",
    });

    let UploadRes;

    if (image) {
      UploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "EQUITY_EAGLE",
      });
    }

    const commentS = new CommentsModel({
      userId: userId,
      username: user.username,
      profile: user.profile,
      desc: desc,
      image: UploadRes, // This will be undefined if image is not provided
    });

    const [commentsetup, notification] = await Promise.all([
      commentS.save().catch((error) => {
        console.error("Comment validation error:", error);
      }),
      commentNotify.save(),
    ]);

    await setup.updateOne({ $push: { comments: commentsetup } });
    await owner.updateOne({ $push: { notification: notification } });

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getSetupLikes = async (req, res) => {
  try {
    const { setupId } = req.params;
    const setup = await SetupModel.findById(setupId);
    const likes = setup.likes;
    const comments = setup.comments;
    const views = setup.views;
    const star = setup.star;
    res.status(200).json({ likes, comments, views, star });
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
    const user = await UserModel.findById(userId);
    const owner = await UserModel.findById(Comment.userId);

    const commentNotify = new NotificationModel({
      userId: Comment.userId,
      image: user.profile,
      body: `${user.name} liked your comment`,
      text: `${Comment.desc}`,
      seen: false,
      type: "like",
    });

    const notification = await commentNotify.save();

    if (Comment.likes.includes(userId)) {
      await Comment.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Comment Unliked");
    } else {
      await Comment.updateOne({ $push: { likes: userId } });
      await owner.updateOne({ $push: { notification: notification } });
      res.status(200).json("Comment Liked");
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getSetupComments = async (req, res) => {
  try {
    const { setupId } = req.params;
    const setup = await SetupModel.findById(setupId);
    const comments = setup.comments;
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

export const PublishIdea = async (req, res) => {
  try {
    const { userId } = req.params;
    const { desc, image, pair, type } = req.body;
    const user = await UserModel.findById(userId);

    if (image) {
      const newSetup = new SetupModel({
        userId: userId,
        username: user.username,
        profile: user.profile,
        desc: desc,
        pair: pair,
        type: type,
        image: image,
      });

      const publishedSetup = await newSetup.save();
      await user.updateOne({ $push: { ideas: publishedSetup } });

      res.status(201).json(publishedSetup);
    } else {
      return res.status(404).json("Image is required");
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const deletedIdea = await SetupModel.findByIdAndDelete(ideaId);
    if (!deletedIdea) {
      return res.status(404).json({ error: "Idea not found" });
    }
    res.status(200).json({ message: "Idea deleted", deletedIdea });
  } catch (error) {
    console.error({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
