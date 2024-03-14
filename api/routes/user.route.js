import express from "express";
import { deleteUser, getUser, updateUser } from "../controllers/user.controller.js"
import {verifyToken} from "../utils/verifyUser.js";
import { verifyPassword } from "../utils/verifyPassword.js";
import { getAllListing } from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/update/:id", verifyPassword, verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getAllListing);
router.get('/:id', verifyToken, getUser)

export default router;
