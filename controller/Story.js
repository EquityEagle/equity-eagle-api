import StoryDetailsModel from "../models/StoryDetailsModel.js";
import StoryModel from "../models/StoryModel.js";
import UserModel from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

export const ShareStory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { text, img } = req.body;
    const user = await UserModel.findById(userId);

    if (img) {
      const uploadRes = await cloudinary.uploader.upload(img, {
        upload_preset: "EE-STORY",
      });
      if (uploadRes) {
        const newStory = new StoryDetailsModel({
          text: text,
          img: uploadRes,
        });
        const savedStory = await newStory.save();

        const story = new StoryModel({
          userId: userId,
          profile: user.profile,
          username: user.username,
          story: savedStory,
        });
        const savedstory = await story.save();
        res.status(201).json(savedstory);
      }
    } else {
      const newStory = new StoryDetailsModel({
        text: text,
        // img: uploadRes,
      });
      const savedStory = await newStory.save();

      const story = new StoryModel({
        userId: userId,
        profile: user.profile,
        username: user.username,
        story: savedStory,
      });
      const savedstory = await story.save();
      res.status(201).json(savedstory);
    }
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};
