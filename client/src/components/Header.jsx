import React from 'react'
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-secondaryBright w-screen  border-b-2 p-1 pb-[6px] shadow-lg">
        <div className="max-w-[1600px] mx-auto px-14 flex justify-between items-center">
          <Link to="/">
            <img className="w-32" src="./public/BrightEstD.png" alt="logo" />
          </Link>
          <div className=" flex gap-8 items-center">
          <div className=" relative flex items-center">
            <input className=" bg-primaryBright p-2 w-80 outline-none rounded-md" placeholder="Search..." type="text" name="" id="" />
            <IoIosSearch size={24} color="#222831" className=" absolute right-1" />
          </div>
          <div className=" w-[2px] h-10 bg-primaryDark rounded-full"></div>
          <div className=" flex gap-3">
            <Link className=" p-2 text-xl hover:scale-110 transition-all hover:text-primaryColor text-primaryDark" to="/home">Home</Link>
            <Link className=" p-2 text-xl hover:scale-110 transition-all hover:text-primaryColor text-primaryDark" to="/about">About</Link>
            <Link className=" p-2 text-xl hover:scale-110 transition-all hover:text-primaryColor text-primaryBright px-6 bg-secondaryDark rounded-md" to="/login">Login</Link>
          </div>
          </div>
        </div>
      </header>
  )
}

export default Header