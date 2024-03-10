import React from "react";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import GAuth from "../components/GAuth";

function Login() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email:"",
    password:""
  });
  const {loading,error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart())
    try {
      const res = await fetch("api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message))
      }else{
        dispatch(signInSuccess(data))
        navigate('/home')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
    
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="max-w-[1600px] overflow-hidden relative mx-auto">
      <img
        src="public/apartment.png"
        alt=""
        className=" absolute w-[540px]  -z-10 bottom-20 sm:bottom-0 sm:-left-60 -left-36 xl:left-28"
      />
      <h1 className=" text-center text-5xl mt-14 mb-6 text-primaryDark font-semibold">
        Login
      </h1>
      <div className=" sm:w-[450px] w-[350px] p-8 py-14 mb-64 rounded-lg bg-slate-50 bg-opacity-70 z-10 mx-auto">
        <form onSubmit={handleSubmit} className="  flex flex-col" action="">
          <label className=" font-semibold" htmlFor="username">
            Email
          </label>
          <input
            className=" mb-4 p-2 rounded-lg outline-none"
            type="email"
            name=""
            id="email"
            onChange={handleChange}
          />
          <label className=" font-semibold" htmlFor="psw">
            Password
          </label>
          <input
            className=" mb-4 p-2 rounded-lg outline-none"
            type="password"
            name=""
            id="password"
            onChange={handleChange}
          />
          <button disabled={loading} className="mb-2 p-4 rounded-lg hover:scale-105 transition-all hover:text-primaryColor bg-primaryDark text-primaryBright w-full">{loading?"logging..." : "Login"}</button>
          {error && <p className=" text-red-500 mt-4">{error}</p>}
        </form>
        <div className=" flex gap-2 my-2">
          <span className=" block">
            Don't you have an account?
          </span>
          <Link to={"/signUp"}>
            <span className="text-primaryColor font-semibold hover:underline">Sign Up</span>
          </Link>
        </div>
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

export default Login;
