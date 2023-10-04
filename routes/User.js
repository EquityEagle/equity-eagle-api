import express from "express";
import {
  editUser,
  getUser,
  getUserById,
  getUsers,
} from "../controller/User.js";

const router = express.Router();

router.get("/one/:username", getUser);
router.get("/one/id/:userId", getUserById);
router.get("/", getUsers);
router.patch("/edit/:userId", editUser);

export default router;
