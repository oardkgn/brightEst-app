import User from "../models/user.model.js";
import bcyrptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";

const signUp = async(req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPsw = bcyrptjs.hashSync(password,10)
  const user = new User({username, email, password:hashedPsw});
  try {
    await user.save();
    res.status(201).json("User created succesfuly!")
  } catch (error) {
   next(error) 
  }
};
export default signUp;
