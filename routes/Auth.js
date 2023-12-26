import express from "express";
import {
  LoginUser,
  LoginWithMail,
  RegisterUser,
  RegisterWithMoile,
} from "../controller/Auth.js";

const router = express.Router();

router.post("/new", RegisterUser);
router.post("/login", LoginUser);
router.post("/mail-login", LoginWithMail);
router.post("/new/mobile", RegisterWithMoile);

export default router;
