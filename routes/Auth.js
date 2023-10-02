import express from "express";
import { LoginUser, LoginWithMail, RegisterUser } from "../controller/Auth.js";

const router = express.Router();

router.post("/new", RegisterUser);
router.post("/login", LoginUser);
router.post("/mail-login", LoginWithMail);

export default router;
