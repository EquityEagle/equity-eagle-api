import UserModel from "../models/UserModel.js";

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate total lots
    const { trades } = user;
    const totalLots = trades.reduce(
      (accumulator, trade) => accumulator + trade.lotSize,
      0
    );

    // Calculate win rate
    const totalTrades = trades.length;
    const winningTrades = trades.filter(
      (trade) => trade.status === "Win"
    ).length;

    // Calculate win rate as a percentage
    const winRate = (winningTrades / totalTrades) * 100;

    // Update the user's lots and winRate properties
    user.lots = totalLots;
    user.winRate = winRate;

    // Save the updated user
    await user.save();

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
