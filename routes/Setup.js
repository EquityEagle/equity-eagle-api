import express from "express";
import {
  CommentOnSetup,
  LikeSetup,
  LikeSetupComments,
  PublishSetup,
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

export default router;
