import express from "express";
import { DocTrade, editTrade } from "../controller/Trade.js";

const router = express.Router();

router.post("/new/", DocTrade);
router.patch("/edit/:trackId", editTrade);

export default router;
