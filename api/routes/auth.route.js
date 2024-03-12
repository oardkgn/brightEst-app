import express from "express";
import {signUp, logIn, googleLogin, signOut} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", logIn);
router.post("/google", googleLogin);
router.get("/signout", signOut);

export default router;
