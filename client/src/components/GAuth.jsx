import React from "react";
import {
  GoogleAuthProvider,
  getAuth,
  signInAnonymously,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
function GAuth() {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleLogin = async () => {
    dispatch(signInStart())
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message))
      console.log("Couldn't sign in with Google!", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className=" bg-primaryDark  hover:scale-105 transition-all hover:text-primaryColor text-primaryBright text-center w-full p-4 rounded-xl flex items-center justify-center gap-4"
    >
      <FcGoogle size={24} />
      <span>Login with Google</span>
    </button>
  );
}

export default GAuth;
