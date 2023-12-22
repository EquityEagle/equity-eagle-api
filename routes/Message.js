import express from "express";
import {
  createMessage,
  getMessage,
  getUnreadMessage,
} from "../controller/Message.js";

const router = express.Router();

router.get("/all/:chatId", getMessage);
router.post("/msg", createMessage);
router.get("/msg/unread/:chatId", getUnreadMessage);

export default router;
