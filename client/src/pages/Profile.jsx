import React from "react";
import { useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
import { useRef, useState, useEffect } from "react";
import { IoAddCircle } from "react-icons/io5";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileLoading, setFileLoading] = useState(false);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const handleFileChange = (file) => {
    setFileLoading(true);
    setFileUploadError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `avatars/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    if (filePer == 100) {
      setFileLoading(false);
    }
  }, [filePer]);

  useEffect(() => {
    if (file) {
      handleFileChange(file);
    }
  }, [file]);

  return (
    <div className=" max-w-[1600px] relative flex gap-8 mx-auto p-2 sm:p-12">
      <img className=" absolute w-96 -left-10 -bottom-10 -rotate-45 -z-10" src="avatar1.png" alt="" />
      <img className=" absolute w-96 left-40 -top-10 rotate-45 -z-10" src="avatar2.png" alt="" />
      <img className=" absolute w-[600px] -right-10 top-44 -z-10" src="estate1.png" alt="" />
      <div className=" bg-secondaryBright rounded-md p-6 bg-opacity-85 sm:w-[460px] w-full">
        <div className=" relative w-fit mx-auto">
          <img
            className=" rounded-md w-28 h-28 object-cover shadow-md"
            src={formData.avatar || currentUser.avatar}
            alt=""
          />
          {fileUploadError && (
            <span className="text-red-700 absolute -left-32 top-0 text-sm w-32">
              Error Image upload (image must be less than 2 mb)
            </span>
          )}
          <input
            ref={fileRef}
            type="file"
            className=" hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={() => fileRef.current.click()}
            className=" bg-primaryBright w-8 h-8 absolute shadow-lg transition-all hover:scale-110 -right-1 -bottom-1 rounded-md"
          >
            {fileLoading ? (
              <span className="text-primaryDark text-xs">%{filePer}</span>
            ) : (
              <MdEdit className=" text-primaryDark mx-auto" />
            )}
          </button>
        </div>
        <form className=" flex flex-col gap-6 p-8" action="">
          <div className=" relative">
            <label htmlFor="username">Username</label>
            <button className=" bg-primaryBright absolute shadow-lg transition-all hover:scale-110 top-[1.65rem] right-1 p-2 rounded-md">
              <MdEdit className=" text-primaryDark" />
            </button>
            <input
              className=" block w-full p-2 rounded-md outline-none"
              type="text"
              id="username"
              disabled={true}
              value={currentUser.username}
            />
          </div>
          <div className="relative">
            <label htmlFor="email">Email</label>
            <button className=" bg-primaryBright absolute shadow-lg transition-all hover:scale-110 top-[1.65rem] right-1 p-2 rounded-md">
              <MdEdit className=" text-primaryDark" />
            </button>
            <input
              className=" block w-full p-2 rounded-md outline-none"
              type="email"
              id="email"
              disabled={true}
              value={currentUser.email}
            />
          </div>
          <div className=" relative">
            <label htmlFor="password">Password</label>
            <button className=" bg-primaryBright absolute shadow-lg transition-all hover:scale-110 top-[1.65rem] right-1 p-2 rounded-md">
              <MdEdit className=" text-primaryDark" />
            </button>
            <input
              className=" block w-full p-2 rounded-md outline-none"
              type="password"
              id="password"
              disabled={true}
              value={1111111111}
            />
          </div>
          <button className=" transition-all hover:opacity-70 w-full p-2 rounded-md bg-primaryDark text-primaryBright">
            Update
          </button>
          <div className=" flex gap-2">
            <button
              className=" transition-all hover:opacity-70 bg-red-400 w-full p-2 rounded-md  text-primaryBright"
              type="button"
            >
              Sign Out
            </button>
            <button
              className=" transition-all hover:opacity-70 bg-red-800 w-full p-2 rounded-md  text-primaryBright"
              type="button"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
      <div className=" w-full  bg-opacity-80">
        <div className=" mb-4">
          <h3 className="text-2xl">My listing estates (0)</h3>
          <div className=" bg-secondaryBright bg-opacity-80 w-full h-64 p-4 flex gap-4 rounded-md">
            <button className="hover:scale-105 transition-all h-full w-56 rounded-md text-primaryDark border-2 border-primaryDark flex justify-center items-center">
              <IoAddCircle size={54} />
            </button>
          </div>
        </div>
        <div className="">
          <h3 className="text-2xl">Watch list (0)</h3>
          <div className=" bg-secondaryBright bg-opacity-80 w-full h-64 p-4 flex gap-4 rounded-md">
            <button className="hover:scale-105 transition-all h-full w-56 rounded-md text-primaryDark border-2 border-primaryDark flex justify-center items-center">
              <IoAddCircle size={54} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
