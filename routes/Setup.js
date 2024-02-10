import express from "express";
import {
  CommentOnSetup,
  LikeSetup,
  LikeSetupComments,
  PublishIdea,
  PublishSetup,
  StarSetup,
  deleteIdea,
  getAllSetup,
  getSetup,
  getSetupCommentLikes,
  getSetupComments,
  getSetupLikes,
} from "../controller/Setup.js";

const router = express.Router();

router.get("/", getAllSetup);
router.get("/:setupId/:userId/one", getSetup);
router.get("/:setupId/comment/all", getSetupComments);
router.get("/:commentId/comment/likes", getSetupCommentLikes);
router.post("/new/:userId", PublishSetup);
router.post("/new/:userId/idea", PublishIdea);
router.patch("/:setupId/:userId/like", LikeSetup);
router.patch("/:setupId/:userId/comment", CommentOnSetup);
router.get("/like/comment/:setupId", getSetupLikes);
router.patch("/:commentsId/like/:userId", LikeSetupComments);
router.patch("/:setupId/:userId/star", StarSetup);
router.delete("/:ideaId/delete", deleteIdea);

export default router;
