import ProfitDataModel from "../models/ProfitDataModel.js";
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
    const totalLots = user.trades.reduce(
      (accumulator, trade) => accumulator + trade.lotSize,
      0
    );

    // Calculate win rate
    const totalTrades = user.trades.length;
    const winningTrades = user.trades.filter(
      (trade) => trade.profit !== 0
    ).length;

    // Handle division by zero
    const winRate = totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;

    // Calculate highest and lowest profit
    const profits = user.trades.map((trade) => trade.profit);
    const Loss = user.trades.map((trade) => trade.loss);

    // Check if there are profits before finding the max and min
    const highestProfit = profits.length === 0 ? 0 : Math.max(...profits);
    const highestLoss = Loss.length === 0 ? 0 : Math.max(...Loss);

    // Update the user's lots, winRate, highestProfit, and lowestProfit properties
    user.lots = totalLots;
    user.winRate = winRate;
    user.highestProfit = highestProfit;
    user.lowestProfit = highestLoss;

    const updatedUser = {
      _id: user.id,
      name: user.name,
      username: user.username,
      trades: totalTrades,
      lotsSize: totalLots,
      winrate: winRate,
      highProfit: highestProfit,
      highLoss: highestLoss,
    };

    // Save the updated user
    await user.save();

    return res.status(200).json(updatedUser);
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
