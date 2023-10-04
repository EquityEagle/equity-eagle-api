import UserModel from "../models/UserModel.js";

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
      "-password -notification"
    );

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
    // Calculate win rate
    const totalTrades = trades.length;
    const winningTrades = trades.filter(
      (trade) => trade.status === "Win"
    ).length;

    // Check if there are no trades (totalTrades is zero)
    const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;

    // Calculate highest and lowest profit
    const profits = trades.map((trade) => trade.profit);
    const highestProfit = Math.max(...profits);
    const lowestProfit = Math.min(...profits);

    // Update the user's lots, winRate, highestProfit, and lowestProfit properties
    user.lots = totalLots;
    user.winRate = winRate;
    user.highestProfit = highestProfit;
    user.lowestProfit = lowestProfit;

    // Save the updated user
    await user.save();

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

    // Check if there are no trades (totalTrades is zero)
    const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;

    // Calculate highest and lowest profit
    const profits = trades.map((trade) => trade.profit);
    const highestProfit = Math.max(...profits);
    const lowestProfit = Math.min(...profits);

    // Update the user's lots, winRate, highestProfit, and lowestProfit properties
    user.lots = totalLots;
    user.winRate = winRate;
    user.highestProfit = highestProfit;
    user.lowestProfit = lowestProfit;

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
