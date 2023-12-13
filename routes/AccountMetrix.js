import express from "express";
import {
  FindAccount,
  TrackAccount,
  deleteAccount,
  findAccount,
  getProfitdata,
  getTrades,
} from "../controller/AccountMetrix.js";

const router = express.Router();

router.post("/track/:userId", TrackAccount);
router.get("/find/:trackId/one", findAccount);
router.get("/find/:userId/all", FindAccount);
router.get("/find/:metrixId/one/trades", getTrades);
router.get("/find/:metrixId/one/p/data", getProfitdata);
router.delete("/delete/:trackId", deleteAccount);

export default router;
