import express from "express";
import {
  BagSetup,
  CommentOnSetup,
  LikeSetup,
  LikeSetupComments,
  PublishSetup,
  StarSetup,
  getAllSetup,
  getSetup,
  getSetupLikes,
} from "../controller/Setup.js";

const router = express.Router();

router.get("/", getAllSetup);
router.get("/:setupId/:userId/one", getSetup);
router.post("/new/:userId", PublishSetup);
router.patch("/:setupId/:userId/like", LikeSetup);
router.patch("/:setupId/:userId/comment", CommentOnSetup);
router.get("/like/comment/:setupId", getSetupLikes);
router.patch("/:commentsId/like/:userId", LikeSetupComments);
router.patch("/:setupId/:userId/star", StarSetup);
router.patch("/:setupId/:userId/bag", BagSetup);

export default router;
