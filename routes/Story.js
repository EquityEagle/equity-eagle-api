import express from "express";
import { ShareStory } from "../controller/Story.js";

const router = express.Router();

router.post("/new/:userId", ShareStory);

export default router;
