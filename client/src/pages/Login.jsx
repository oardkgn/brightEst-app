import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

function Login() {
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
        <form className="  flex flex-col" action="">
          <label className=" font-semibold" htmlFor="username">
            Username
          </label>
          <input
            className=" mb-4 p-2 rounded-lg outline-none"
            type="text"
            name=""
            id="username"
          />
          <label className=" font-semibold" htmlFor="psw">
            Password
          </label>
          <input
            className=" mb-4 p-2 rounded-lg outline-none"
            type="password"
            name=""
            id="psw"
          />
        </form>
        <div>
          <span className=" block font-semibold">
            Don't you have an account?
          </span>
          <Link to={"/signUp"}>
            <button className=" mb-4 p-4 rounded-lg hover:scale-105 transition-all hover:text-primaryColor bg-primaryDark text-primaryBright w-full">
              Sign Up
            </button>
          </Link>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className=" w-full bg-primaryDark h-0.5 rounded-xl"></div>
          <span>Or</span>
          <div className=" w-full bg-primaryDark h-0.5 rounded-xl"></div>
        </div>
        <button className=" bg-primaryDark  hover:scale-105 transition-all hover:text-primaryColor text-primaryBright text-center w-full p-4 rounded-xl flex items-center justify-center gap-4">
          <FcGoogle size={24} />
          <span>Login with Google</span>
        </button>
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
