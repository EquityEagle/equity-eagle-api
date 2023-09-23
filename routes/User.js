import express from "express";
import { editUser, getUser } from "../controller/User.js";

const router = express.Router();

router.get("/one/:username", getUser);
router.patch("/edit/:userId", editUser);

export default router;
