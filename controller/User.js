import UserModel from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select(
      "-password -notification -trades"
    );
    res.status(200).json(users);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username: username }).select(
      "-password -notification -trades"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).select(
      "-password -notification"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const updatedProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profile } = req.body;

    if (profile) {
      const uploadRes = await cloudinary.uploader.upload(profile, {
        upload_preset: "EQUITY_EAGLE_PROFILE",
      });

      if (uploadRes) {
        const user = await UserModel.findByIdAndUpdate(
          userId,
          { profile: uploadRes },
          {
            new: true,
          }
        );
        res.status(200).json(user);
      }
    } else {
      return res.status(404).json("Image required");
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
