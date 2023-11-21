import express from "express";
import {
  FindAccount,
  TrackAccount,
  findAccount,
  getProfitdata,
  getTrades,
} from "../controller/AccountMetrix.js";

const router = express.Router();

router.post("/track/:userId", TrackAccount);
router.get("/find/:trackId/one", findAccount);
router.get("/find/all", FindAccount);
router.get("/find/:metrixId/one/trades", getTrades);
router.get("/find/:metrixId/one/p/data", getProfitdata);

export default router;
