import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import GAuth from "../components/GAuth";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch("api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure());
      } else {
        dispatch(signInSuccess());
        navigate("/home");
      }
    } catch (error) {
      dispatch(signInFailure());
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="max-w-[1600px] overflow-hidden relative mx-auto px-2 ">
      <img
        src="public/apartment.png"
        alt=""
        className=" absolute w-[540px] -z-10 bottom-20 sm:bottom-0 sm:-left-60 -left-36 xl:left-28"
      />
      <h1 className=" text-center text-5xl mt-14 mb-6 text-primaryDark font-semibold">
        Sign Up
      </h1>
      <div className=" sm:w-[450px] w-[350px] p-8 py-14 mb-36 rounded-lg bg-slate-50 bg-opacity-70 z-10 mx-auto">
        <form onSubmit={handleSubmit} className=" flex flex-col" action="">
          <label className=" font-semibold" htmlFor="username">
            Username
          </label>
          <input
            className=" mb-4 p-2 rounded-lg outline-none"
            type="text"
            name=""
            id="username"
            onChange={handleChange}
          />
          <label className=" font-semibold" htmlFor="password">
            Password
          </label>
          <input
            className=" mb-4 p-2 rounded-lg outline-none"
            type="password"
            name=""
            id="password"
            onChange={handleChange}
          />
          <label className=" font-semibold" htmlFor="passwordC">
            Confirm Password
          </label>
          <input
            className=" mb-4 p-2 rounded-lg outline-none"
            type="password"
            name=""
            id="passwordC"
          />
          <label className=" font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className=" mb-4 p-2 rounded-lg outline-none"
            type="email"
            name=""
            id="email"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="hover:scale-105 transition-all mb-4 hover:text-primaryColor bg-primaryDark text-primaryBright text-center w-full p-4 rounded-xl flex items-center justify-center"
          >
            <span>{loading ? "Signing Up..." : "Sign Up"}</span>
          </button>
          {error && <p className=" text-red-500 mt-4">{error}</p>}
        </form>
        <div className="flex items-center gap-2 mb-4">
          <div className=" w-full bg-primaryDark h-0.5 rounded-xl"></div>
          <span>Or</span>
          <div className=" w-full bg-primaryDark h-0.5 rounded-xl"></div>
        </div>
        <GAuth />
      </div>
      <img
        src="public/villa.png"
        alt=""
        className=" absolute w-[540px] -z-10 -bottom-5 -right-60 xl:right-28 hidden sm:block"
      />
    </div>
  );
}

export default Register;
