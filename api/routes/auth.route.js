import express from "express";
import authCntrl from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signUp", authCntrl);

export default router;
