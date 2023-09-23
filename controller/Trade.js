import TradeModel from "../models/TradeModel.js";
import UserModel from "../models/UserModel.js";

export const DocTrade = async (req, res) => {
  try {
    const { userId } = req.params;
    const User = await UserModel.findById(userId);
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    const { currency, symbol, type, lotSize, status, why } = req.body;

    // Validate the input data here if needed

    const docTrade = new TradeModel({
      currency: currency,
      symbol: symbol,
      type: type,
      lotSize: lotSize,
      why: why,
      status: "Running",
    });

    const newTrade = await docTrade.save();
    await User.updateOne({ $push: { trades: newTrade } });

    return res.status(201).json(newTrade);
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).json({ error: error.message });
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
