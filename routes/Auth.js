import express from "express";
import {
  LoginUser,
  LoginWithMail,
  MobileLogin,
  RegisterUser,
  RegisterWithMoile,
  findSwitchUser,
} from "../controller/Auth.js";

const router = express.Router();

router.post("/new", RegisterUser);
router.post("/login", LoginUser);
router.post("/mail-login", LoginWithMail);
router.post("/new/mobile", RegisterWithMoile);
router.post("/login/mobile", MobileLogin);
router.post("/switch/:userId", findSwitchUser);

export default router;
