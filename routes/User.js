import express from "express";
import {
  ConnectWithTraders,
  editUser,
  getUser,
  getUserById,
  getUsers,
  updatedProfile,
} from "../controller/User.js";

const router = express.Router();

router.get("/one/:username", getUser);
router.get("/one/id/:userId", getUserById);
router.get("/", getUsers);
router.patch("/edit/:userId", editUser);
router.patch("/edit/profile/:userId", updatedProfile);
router.patch("/connect/:userId/:connectorsId", ConnectWithTraders);

export default router;
