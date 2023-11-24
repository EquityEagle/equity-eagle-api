import CommunityModel from "../models/CommunityModel";
import UserModel from "../models/UserModel";

export const createCommunity = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    const { name, desc } = req.body;
    const slugName = name.toLowerCase().replace(/\s+/g, "-");

    const newcommunity = new CommunityModel({
      ownerId: userId,
      ownername: user.name,
      ownerUsername: user.username,
      ownerProfile: user.profile,
      name: name,
      desc: desc,
      slug: slugName,
    });
    const community = await newcommunity.save();
    await user.updateOne({ $push: { community: community } });
    return res.status(201).json(community);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
