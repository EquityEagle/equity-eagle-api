import ProfitDataModel from "../models/ProfitDataModel.js";
import TradeModel from "../models/TradeModel.js";
import UserModel from "../models/UserModel.js";

export const DocTrade = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { symbol, type, lotSize, profit, loss, why, setup, confluence } =
      req.body;

    // Validate input data here (if needed)
    // For example, check if required fields are present, validate types, etc.

    const docTrade = new TradeModel({
      symbol,
      type,
      lotSize,
      why,
      profit,
      setup,
      confluence,
      loss,
      status: "Running",
    });

    // Save the new trade
    const newTrade = await docTrade.save();

    // Create new ProfitData
    const editedData = new ProfitDataModel({
      tradeId: newTrade._id,
      profit,
      loss,
    });

    const profitData = await editedData.save();

    // Update the user with the new trade
    await user.updateOne({ $push: { trades: newTrade } });

    // Update the trade with the new ProfitData
    await newTrade.updateOne({ $push: { profitData: profitData } });

    return res.status(201).json(newTrade);
  } catch (error) {
    console.error("DocTrade error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editDoc = async (req, res) => {
  try {
    const { docId } = req.params;
    const updatedDoc = await TradeModel.findByIdAndUpdate(docId, req.body, {
      new: true,
    });

    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res.status(200).json(updatedDoc);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

export const editPrice = async (req, res) => {
  try {
    const { docId } = req.params;
    const { profit, loss } = req.body;
    const editedData = new ProfitDataModel({
      tradeId: docId,
      profit: profit,
      loss: loss,
    });
    const docTrade = await TradeModel.findById(docId);
    docTrade.updateOne({ $push: { profitData: editedData } });
    docTrade.updateOne({ $set: { profit: profit, loss: loss } });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
