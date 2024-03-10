import express from "express";
import {signUp, logIn, googleLogin} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", logIn);
router.post("/google", googleLogin);

export default router;
