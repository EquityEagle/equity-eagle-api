import AccountMetrixModal from "../models/AccountMetrix.js";
import ProfitDataModel from "../models/ProfitDataModel.js";
import TradeModel from "../models/TradeModel.js";
import UserModel from "../models/UserModel.js";

export const DocTrade = async (req, res) => {
  try {
    const { accounthash } = req.params;

    const { symbol, type, lotSize, profit, loss, why } = req.body;

    const account = await AccountMetrixModal.findOne({
      accounthash: accounthash,
    });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const modifiedProfit = loss > 0 && profit === 0 ? -loss : profit;

    const docTrade = new TradeModel({
      symbol: symbol,
      type: type,
      lotSize: lotSize,
      why: why,
      profit: profit,
      loss: loss,
      status: "Running",
    });
    const newTrade = await docTrade.save();

    const editedData = new ProfitDataModel({
      tradeId: newTrade._id,
      profit: modifiedProfit,
    });

    const profitData = await editedData.save();
    await account.updateOne({ $push: { trades: newTrade } });
    await account.updateOne({ $push: { profitdata: profitData } });
    console.log("Trade saved");

    return res.status(201).json(newTrade);
  } catch (error) {
    console.error({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const editTrade = async (req, res) => {
  try {
    const { accounthash } = req.params;
    const trade = await TradeModel.findOneAndUpdate(
      { accounthash: accounthash },
      req.body,
      { new: true }
    );
    res.status(200).json(trade);
  } catch (error) {
    console.error({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
