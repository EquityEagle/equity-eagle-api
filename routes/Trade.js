import express from "express";
import { DocTrade } from "../controller/Trade.js";

const router = express.Router();

router.post("/new/:trackId", DocTrade);
// router.patch("/edit/:docId", editDoc);
// router.patch("/edit/profit", editPrice);

export default router;
