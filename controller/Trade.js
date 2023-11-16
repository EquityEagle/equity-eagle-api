import AccountMetrixModal from "../models/AccountMetrix.js";
import ProfitDataModel from "../models/ProfitDataModel.js";
import TradeModel from "../models/TradeModel.js";
import UserModel from "../models/UserModel.js";

export const DocTrade = async (req, res) => {
  try {
    const { trackId } = req.params;
    const account = await AccountMetrixModal.findById(trackId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const { symbol, type, lotSize, profit, loss, why, setup, confluence } =
      req.body;

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
    const newTrade = await docTrade.save();

    const editedData = new ProfitDataModel({
      tradeId: newTrade._id,
      profit,
      loss,
    });

    const profitData = await editedData.save();
    await account.updateOne({ $push: { trades: newTrade } });
    await account.updateOne({ $push: { profitdata: profitData } });

    return res.status(201).json(newTrade);
  } catch (error) {
    console.error({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

// export const editDoc = async (req, res) => {
//   try {
//     const { docId } = req.params;
//     const updatedDoc = await TradeModel.findByIdAndUpdate(docId, req.body, {
//       new: true,
//     });

//     if (!updatedDoc) {
//       return res.status(404).json({ message: "Document not found" });
//     }

//     return res.status(200).json(updatedDoc);
//   } catch (error) {
//     console.log({ error: error.message });
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const editPrice = async (req, res) => {
//   try {
//     const { docId } = req.params;
//     const { profit, loss } = req.body;
//     const editedData = new ProfitDataModel({
//       tradeId: docId,
//       profit: profit,
//       loss: loss,
//     });
//     const docTrade = await TradeModel.findById(docId);
//     docTrade.updateOne({ $push: { profitData: editedData } });
//     docTrade.updateOne({ $set: { profit: profit, loss: loss } });
//   } catch (error) {
//     console.log({ error: error.message });
//     return res.status(500).json({ error: error.message });
//   }
// };
