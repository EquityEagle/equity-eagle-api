import express from "express";
import {
  ReadNotifications,
  getNotifications,
  getUnreadNotifications,
} from "../controller/Notification";

const router = express.Router();

router.get("/:userId", getNotifications);
router.get("/unread/:userId", getUnreadNotifications);
router.patch("/mark/:userId/:noteId", ReadNotifications);

export default router;
