import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
import { useRef, useState, useEffect } from "react";
import { IoAddCircle } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteFailure,
  deleteStart,
  deleteSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

function Profile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileLoading, setFileLoading] = useState(false);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [confirmPsw, setConfirmPsw] = useState(false);
  const [listings, setListings] = useState([]);

  const dispatch = useDispatch();

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

  const handleChange = (e) => {
    const modifiedData = { ...formData, [e.target.id]: e.target.value };
    setFormData(modifiedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSuccess(data));
      setConfirmPsw(false);
      setUserUpdateSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDelete = async () => {
    dispatch(deleteStart());
    try {
      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess());
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const getAllListings = async () => {
    try {
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      setListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleListingDelete = async(listingID) => {
    try {
      const res = await fetch(`api/listing/delete/${listingID}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        console.log(data.message);
        return;
      }
      setListings(listings.filter((listing) => listing._id != listingID))
    } catch (error) {
      console.log(error.message);
    }
  }

  console.log(listings);

  const handleSignOut = async () => {
    dispatch(deleteStart());
    try {
      const res = await fetch(`api/auth/signout`);
      const data = await res.json();
      if (data.success == false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess());
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
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

  useEffect(() => {
    getAllListings();
  }, []);

  return (
    <div className=" max-w-[1600px] relative flex gap-8 mx-auto p-2 sm:p-12">
      <img
        className=" absolute w-96 -left-10 -bottom-10 -rotate-45 -z-10"
        src="avatar1.png"
        alt=""
      />
      <img
        className=" absolute w-96 left-40 -top-10 rotate-45 -z-10"
        src="avatar2.png"
        alt=""
      />
      <img
        className=" absolute w-[600px] -right-10 top-44 -z-10"
        src="estate1.png"
        alt=""
      />
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
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, username: currentUser.username });
              }}
              className=" bg-primaryBright absolute shadow-lg transition-all hover:scale-110 top-[1.65rem] right-1 p-2 rounded-md"
            >
              <MdEdit className=" text-primaryDark" />
            </button>
            <input
              className=" block w-full p-2 rounded-md outline-none"
              type="text"
              id="username"
              disabled={!Object.keys(formData).includes("username")}
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
          </div>
          <div className="relative">
            <label htmlFor="email">Email</label>
            <button
              type="button"
              onClick={() => {
                setFormData({ ...formData, email: currentUser.email });
              }}
              className=" bg-primaryBright absolute shadow-lg transition-all hover:scale-110 top-[1.65rem] right-1 p-2 rounded-md"
            >
              <MdEdit className=" text-primaryDark" />
            </button>
            <input
              className=" block w-full p-2 rounded-md outline-none"
              type="email"
              id="email"
              disabled={!Object.keys(formData).includes("email")}
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
          </div>

          {confirmPsw && (
            <div className=" relative">
              <label htmlFor="currentPsw">Current Password</label>
              <input
                className=" block w-full p-2 rounded-md outline-none"
                type="password"
                id="currentPsw"
                onChange={handleChange}
              />
            </div>
          )}

          <div className=" relative">
            <label htmlFor="password">New Password</label>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  password: "1",
                  currentPsw: formData.currentPsw,
                });
                setConfirmPsw(true);
              }}
              className=" bg-primaryBright absolute shadow-lg transition-all hover:scale-110 top-[1.65rem] right-1 p-2 rounded-md"
            >
              <MdEdit className=" text-primaryDark" />
            </button>
            <input
              className=" block w-full p-2 rounded-md outline-none"
              type="password"
              id="password"
              disabled={!Object.keys(formData).includes("password")}
              placeholder="*******"
              onChange={handleChange}
            />
          </div>

          {loading ? (
            <button
              disabled={true}
              className={
                "transition-all w-full p-2 rounded-md bg-primaryDark bg-opacity-75 text-primaryBright"
              }
            >
              <img
                className=" w-6 block mx-auto"
                src="loading-gif.gif"
                alt=""
              />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(formData).length == 0}
              className={
                Object.keys(formData).length == 0
                  ? "transition-all w-full p-2 rounded-md bg-primaryDark bg-opacity-75 text-primaryBright"
                  : "transition-all hover:opacity-70 w-full p-2 rounded-md bg-primaryDark text-primaryBright"
              }
            >
              Update
            </button>
          )}

          {error && <p className=" text-red-500 text-center">{error}</p>}
          {userUpdateSuccess && (
            <p className=" text-green-500 text-center">
              Profile updated successfully!
            </p>
          )}

          <div className=" flex gap-2">
            {loading ? (
              <button
                disabled={true}
                className={
                  "transition-all w-full p-2 rounded-md bg-red-900 bg-opacity-75 text-primaryBright"
                }
              >
                <img
                  className=" w-6 block mx-auto"
                  src="loading-gif.gif"
                  alt=""
                />
              </button>
            ) : (
              <button
                className=" transition-all hover:opacity-70 bg-red-400 w-full p-2 rounded-md  text-primaryBright"
                type="button"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            )}
            {loading ? (
              <button
                disabled={true}
                className={
                  "transition-all w-full p-2 rounded-md bg-red-900 bg-opacity-75 text-primaryBright"
                }
              >
                <img
                  className=" w-6 block mx-auto"
                  src="loading-gif.gif"
                  alt=""
                />
              </button>
            ) : (
              <button
                className=" transition-all hover:opacity-70 bg-red-800 w-full p-2 rounded-md  text-primaryBright"
                type="button"
                onClick={handleDelete}
              >
                Delete Account
              </button>
            )}
          </div>
        </form>
      </div>
      <div className=" w-full  bg-opacity-80">
        <div className=" mb-4">
          <h3 className="text-2xl">My listing estates {listings.length}</h3>
          <div className=" bg-secondaryBright bg-opacity-80 w-full h-64 p-4 flex gap-4 rounded-md">
            {listings.map((listing, key) => {
              return (
                <div
                  className="h-full relative text-primaryDark w-56 bg-gray-300 p-4 rounded-md overflow-hidden"
                  key={key}
                >
                  <img
                    className=" h-32 w-full object-cover rounded-md"
                    src={listing.imageUrls[0]}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <p className="">{listing.name}</p>
                    <p className=" text-sm">
                      {" "}
                      <span className=" font-semibold">$</span>
                      {new Intl.NumberFormat("en-US").format(
                        listing.regularPrice
                      )}
                    </p>
                  </div>
                  <p className=" text-sm text-gray-500 max-w-32 truncate">
                    {listing.type}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      handleListingDelete(listing._id)
                    }}
                    className=" bg-primaryBright absolute shadow-lg transition-all hover:scale-110 top-2 right-2 p-2 rounded-md"
                  >
                    <MdDelete className=" text-red-400" size={20} />
                    
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      
                    }}
                    className=" bg-primaryBright absolute shadow-lg transition-all hover:scale-110 bottom-2 right-2 p-2 rounded-md"
                  >
                    <MdEdit className=" text-yellow-400" size={20} />
                    
                  </button>

                </div>
              );
            })}
            <Link to={"/create-listing"}>
              <button className="hover:scale-105 transition-all h-full w-56 rounded-md text-primaryDark border-2 border-primaryDark flex justify-center items-center">
                <IoAddCircle size={54} />
              </button>
            </Link>
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
