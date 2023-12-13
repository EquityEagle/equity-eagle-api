import express from "express";
import { DocTrade, editTrade } from "../controller/Trade.js";

const router = express.Router();

router.post("/new/:accounthash/", DocTrade);
router.patch("/edit/:tradeId", editTrade);

export default router;
