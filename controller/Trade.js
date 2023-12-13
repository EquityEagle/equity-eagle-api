import AccountMetrixModal from "../models/AccountMetrix.js";
import ProfitDataModel from "../models/ProfitDataModel.js";
import TradeModel from "../models/TradeModel.js";
import UserModel from "../models/UserModel.js";
import cloudinary from "../utils/cloudinary.js";

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
    const { tradeId } = req.params;
    const { entrysty, exitsty, comments, setupImg } = req.body;

    if (setupImg) {
      const uploadRes = cloudinary.uploader.upload(setupImg, {
        upload_preset: "EQUITY_EAGLE",
      });
      if (uploadRes) {
        const toUpdate = {
          setupImg: setupImg,
          entrysty: entrysty,
          exitsty: exitsty,
          comments: comments,
        };

        const trade = await TradeModel.findByIdAndUpdate(tradeId, toUpdate, {
          new: true,
        });

        res.status(200).json(trade);
      }
    } else {
      return res.status(403).json("Setup image required");
    }
  } catch (error) {
    console.error({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
