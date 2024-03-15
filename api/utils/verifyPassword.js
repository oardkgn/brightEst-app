import bcryptjs from 'bcryptjs';
import { errorHandler } from "./error.js";
import User from "../models/user.model.js";

export const verifyPassword = async (req, res, next) => {
  if (req.body.currentPsw) {
    const currentPsw = req.body.currentPsw;
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(errorHandler("User not found!", 404));
    const pswMatch = bcryptjs.compareSync(currentPsw, user.password);
    if (!pswMatch) return next(errorHandler("Wrong password!", 401));
  }
  next()
};
