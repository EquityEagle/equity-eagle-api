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

    // Calculate total lots
    const totalLots = account.trades.reduce(
      (accumulator, trade) => accumulator + trade.lotSize,
      0
    );

    // Calculate win rate
    const totalTrades = account.trades.length;
    const winningTrades = account.trades.filter(
      (trade) => trade.profit !== 0
    ).length;

    // Handle division by zero
    const winRate =
      totalTrades === 0 ? 0 : ((winningTrades / totalTrades) * 100).toFixed(2);

    const profits = account.trades.map((trade) => trade.profit);
    const Loss = account.trades.map((trade) => trade.loss);
    const balance = account.accountsize;
    const equity = balance + profits - Loss;

    // Check if there are profits before finding the max and min
    const totalProfit =
      profits.length === 0
        ? 0
        : profits.reduce((max, value) => Math.max(max, value), 0);
    const totalLoss =
      Loss.length === 0
        ? 0
        : Loss.reduce((max, value) => Math.max(max, value), 0);

    const createdAt = account.createdAt;
    const currentTime = new Date().getTime(); // Current timestamp in milliseconds

    // Calculate the duration in milliseconds
    const durationInMilliseconds = currentTime - createdAt;

    // Calculate the duration in days
    const durationInDays = Math.floor(
      durationInMilliseconds / (1000 * 60 * 60 * 24)
    );

    const updatedAccount = {
      _id: account._id,
      type: account.accounttype,
      balance: balance,
      trades: totalTrades,
      totallots: totalLots,
      winrate: winRate,
      totalProfit: totalProfit,
      totalLoss: totalLoss,
      equity: equity,
      days: durationInDays,
    };

    res.status(200).json(updatedAccount);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const FindAccount = async (req, res) => {
  try {
    const accounts = await AccountMetrixModal.find().sort({ createdAt: -1 });
    if (!accounts) return res.status(404).json("No account found");
    return res.status(200).json(accounts);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getTrades = async (req, res) => {
  try {
    const { metrixId } = req.params;
    const metrix = await AccountMetrixModal.findById(metrixId);
    if (!metrix) return res.status(404).json("Account not found");
    const trades = metrix.trades;
    res.status(200).json(trades);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const getProfitdata = async (req, res) => {
  try {
    const { metrixId } = req.params;
    const metrix = await AccountMetrixModal.findById(metrixId);
    if (!metrix) return res.status(404).json("Account not found");
    const profitData = metrix.profitdata;
    res.status(200).json(profitData);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
