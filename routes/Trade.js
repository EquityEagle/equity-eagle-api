import express from "express";
import { DocTrade, editDoc } from "../controller/Trade.js";

const router = express.Router();

router.post("/new", DocTrade);
router.patch("/edit/:docId", editDoc);

export default router;
