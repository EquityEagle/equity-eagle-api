import express from "express";
import { TrackAccount, findAccount } from "../controller/AccountMetrix.js";

const router = express.Router();

router.post("/track/:userId", TrackAccount);
router.get("/find/:trackId", findAccount);

export default router;
