import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler("You can only update your own account!", 401));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler("You can only delete your own account!", 401));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
export const deleteLike = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(errorHandler(404, "User not found!"));
  }

  if (!user.tracking.includes(req.params.id)) {
    return next(errorHandler(401, "You can only delete your own likes!"));
  }

  const arr = user.tracking.filter((like) => like != req.params.id)

  try {
    await User.findByIdAndUpdate(req.user.id, {
      tracking : arr
    });

    res.status(200).json("Like has been deleted!");
  } catch (error) {
    next(error);
  }
};
export const likeListing = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);
    const listing = await Listing.findById(req.params.id);
    if (
      user &&
      listing &&
      !user.tracking.includes(listing._id) &&
      listing.userRef != user._id
    ) {
      await User.findByIdAndUpdate(req.body.id, {
        $set: {
          tracking: user.tracking.concat(req.params.id),
        },
      });
    } else {
      next(errorHandler("There is something wrong with your request!", 404));
      return;
    }
    res.status(200).json({ message: "Estate liked successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getAllLikes = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const likedListings = []
      for (let i = 0; i < user.tracking.length; i++) {
        const listing = await Listing.findById(user.tracking[i]);
        likedListings.push(listing)
      }
      res.status(200).json(likedListings)
    }else{
      next(errorHandler("User is not found!", 404));
    }
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
