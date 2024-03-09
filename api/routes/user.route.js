import express from "express";
import userCntrl from "../controllers/user.controller.js"

const router = express.Router();

router.get("/test", userCntrl);

export default router;
