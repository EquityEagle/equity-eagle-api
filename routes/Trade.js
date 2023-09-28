import express from "express";
import { DocTrade, editDoc, editPrice } from "../controller/Trade.js";

const router = express.Router();

router.post("/new", DocTrade);
router.patch("/edit/:docId", editDoc);
router.patch("/edit/profit", editPrice);

export default router;
