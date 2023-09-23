import express from "express";
import { LoginUser, RegisterUser } from "../controller/Auth.js";

const router = express.Router();

router.post("/new", RegisterUser);
router.post("/login", LoginUser);

export default router;
