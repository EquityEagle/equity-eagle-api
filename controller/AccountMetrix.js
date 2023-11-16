import AccountMetrixModal from "../models/AccountMetrix.js";
import UserModel from "../models/UserModel.js";

export const TrackAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accounttype, accountsize } = req.body;
    const user = await UserModel.findById(userId);
    const trackingacc = new AccountMetrixModal({
      userId: userId,
      accountsize: accountsize,
      accounttype: accounttype,
    });
    const newaccount = await trackingacc.save();
    await user.updateOne({ $push: { accounts: newaccount } });
    res.status(201).json(newaccount);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const findAccount = async (req, res) => {
  try {
    const { trackId } = req.params;
    const account = await AccountMetrixModal.findById(trackId);
    if (!account) return res.status(404).json("Account not found");
    res.status(200).json(account);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
