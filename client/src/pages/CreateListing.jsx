import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useSelector} from "react-redux"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrls: [],
    address: "",
    type: "sell",
    rooms: {
      bedrooms: 1,
      bathrooms: 1,
      kitchens: 1,
      livingrooms: 1,
    },
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    attributes: {
      security: false,
      parking: false,
      furnished: false,
      wifi: false,
    },
  });
  const [imagesFile, setImagesFile] = useState([]);
  const [imageUploadError, setImageUploadError] = useState("");
  const [imagesUploading, setImagesUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)

  console.log(formData);

  const handleImageUpload = (event) => {
    if (
      imagesFile.length > 0 &&
      imagesFile.length + formData.imageUrls.length < 7
    ) {
      const promises = [];
      setImagesUploading(true);
      for (let i = 0; i < imagesFile.length; i++) {
        promises.push(storeImage(imagesFile[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setImagesUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageUploadError("Each image size must be less than 2MB.");
          setImagesUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images.");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `house-pics/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (e.target.id === "offer") {
      setFormData({
        ...formData,
        offer: e.target.checked,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "security" ||
      e.target.id === "wifi"
    ) {
      setFormData({
        ...formData,
        attributes: {
          ...formData.attributes,
          [e.target.id]: e.target.checked,
        },
      });
    }

    if (
      e.target.id === "regularPrice" ||
      e.target.id === "discountedPrice" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }

    if (
      e.target.id === "kitchens" ||
      e.target.id === "bedrooms" ||
      e.target.id === "bathrooms" ||
      e.target.id === "livingrooms"
    ) {
      setFormData({
        ...formData,
        rooms: {
          ...formData.rooms,
          [e.target.id]: e.target.value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountedPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }else{
        navigate(`/profile`);
      }
      
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.log(error);
    }
  };

  const handleRemoveImage = (index) => {

    const storage = getStorage(app);

    const desertRef = ref(storage, formData.imageUrls[index]);
        // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log("Pre image deleted!");
      })
      .catch((error) => {
        console.log(error);
        return
      });

    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <div className=" p-8 pt-4 mt-2 max-w-[1600px] mx-auto ">
      <h1 className=" text-4xl font-semibold text-primaryDark text-center  mb-2">
        Create a Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-secondaryBright relative flex flex-col lg:flex-row gap-8  p-12 rounded-md"
        action=""
      >
        <div className=" absolute top-4 right-4 transition-all hover:scale-105 bg-primaryDark text-primaryBright p-2 rounded-md">
          <Link to={"/profile"}>
            <FaXmark />
          </Link>
        </div>
        <div className=" flex flex-col flex-1 gap-6 ">
          <div>
            <label className=" font-semibold text-primaryDark" htmlFor="name">
              Name
            </label>
            <input
              maxLength={60}
              minLength={10}
              onChange={handleChange}
              value={formData.name}
              required
              className=" w-full p-2 rounded-md outline-none"
              type="text"
              id="name"
            />
          </div>
          <div>
            <label
              className=" font-semibold text-primaryDark"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={handleChange}
              maxLength={1200}
              className=" w-full p-2 rounded-md outline-none"
              id="description"
            />
          </div>
          <div>
            <label className=" font-semibold text-primaryDark" htmlFor="name">
              Address
            </label>
            <input
              required
              value={formData.address}
              onChange={handleChange}
              maxLength={60}
              minLength={10}
              className=" w-full p-2 rounded-md outline-none"
              type="text"
              id="address"
            />
          </div>

          <div>
            <p className="mb-3 font-semibold text-primaryDark">
              Is the estate for sale or for rent?
            </p>
            <div className=" flex gap-4">
              <input
                onChange={handleChange}
                type="radio"
                id="sale"
                name="type"
                checked={formData.type == "sale"}
                className="w-5"
              />
              <span>Sell</span>

              <input
                onChange={handleChange}
                type="radio"
                id="rent"
                checked={formData.type == "rent"}
                name="type"
                className="w-5"
              />

              <span>Rent</span>
            </div>
          </div>

          <div>
            <p className=" mb-3 font-semibold text-primaryDark">Prices?</p>
            <div className=" flex flex-col md:flex-row gap-8">
              <div className=" flex gap-4 items-center">
                <span>
                  Regular Price <br />
                  {formData.type == "rent" && <span>($/mounth)</span>}
                </span>
                <input
                  onChange={handleChange}
                  min={0}
                  required
                  value={formData.regularPrice}
                  type="number"
                  id="regularPrice"
                  name="type"
                  className="w-32 p-2"
                />
              </div>
              <div className=" flex items-center gap-2">
                <span>Offer</span>
                <input
                  id="offer"
                  className="w-6 h-6 rounded-md"
                  checked={formData.offer}
                  type="checkbox"
                  onChange={handleChange}
                />
              </div>
              {formData.offer && (
                <div className=" flex gap-4 items-center">
                  <span>
                    Discounted Price <br />
                    {formData.type == "rent" && <span>($/mounth)</span>}
                  </span>
                  <input
                    onChange={handleChange}
                    min={0}
                    type="number"
                    value={formData.discountedPrice}
                    id="discountedPrice"
                    name="type"
                    className="w-32 p-2"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <p className=" mb-3 font-semibold text-primaryDark">
              How many room type the estate has?
            </p>
            <div className=" w-full gap-4 mt-2 flex flex-wrap">
              <div>
                <label htmlFor="">Bedroom</label>
                <input
                  className=" p-2 w-12 rounded-md ml-2"
                  min={0}
                  value={formData.rooms.bedrooms}
                  type="number"
                  id="bedrooms"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="">Bathroom</label>
                <input
                  className=" p-2 w-12 rounded-md ml-2"
                  min={0}
                  id="bathrooms"
                  value={formData.rooms.bathrooms}
                  type="number"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="">Kitchen</label>
                <input
                  className=" p-2 w-12 rounded-md ml-2"
                  min={0}
                  id="kitchens"
                  value={formData.rooms.kitchens}
                  type="number"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="">Livingroom</label>
                <input
                  className=" p-2 w-12 rounded-md ml-2"
                  min={0}
                  id="livingrooms"
                  value={formData.rooms.livingrooms}
                  type="number"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <p className=" mb-3 font-semibold text-primaryDark">
              Attributes of the estate?
            </p>
            <div className=" w-full gap-8 mt-2 flex items-center flex-wrap">
              <div className=" flex items-center gap-2">
                <label className="" htmlFor="">
                  Furnitures
                </label>
                <input
                  id="furnished"
                  className="w-6 h-6 rounded-md"
                  checked={formData.attributes.furnished}
                  type="checkbox"
                  onChange={handleChange}
                />
              </div>
              <div className=" flex items-center gap-2">
                <label className="" htmlFor="">
                  Wifi
                </label>
                <input
                  id="wifi"
                  className="w-6 h-6 rounded-md"
                  checked={formData.attributes.wifi}
                  type="checkbox"
                  onChange={handleChange}
                />
              </div>
              <div className=" flex items-center gap-2">
                <label className="" htmlFor="">
                  Security System
                </label>
                <input
                  id="security"
                  className="w-6 h-6 rounded-md"
                  checked={formData.attributes.security}
                  type="checkbox"
                  onChange={handleChange}
                />
              </div>
              <div className=" flex items-center gap-2">
                <label className="" htmlFor="">
                  Parking Spot
                </label>
                <input
                  id="parking"
                  className="w-6 h-6 rounded-md"
                  checked={formData.attributes.parking}
                  type="checkbox"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-1 flex-col">
          <p className="mb-4 text-primaryDark font-semibold">
            İmages <br />{" "}
            <span className=" font-normal text-slate-400">
              The first image will be cover.(max 6)
            </span>
          </p>
          <div className=" flex flex-col md:flex-row gap-4 ">
            <input
              accept="image/*"
              multiple
              onChange={(e) => setImagesFile(e.target.files)}
              className=" border-2 border-primaryDark rounded-md p-2"
              type="file"
              name=""
              id="images"
            />
            {imagesUploading ? (
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
                onClick={handleImageUpload}
                typeof="button"
                className=" max-w-56 py-3 transition-all hover:scale-105 bg-primaryDark rounded-md px-8 text-primaryBright"
                type="button"
              >
                Upload
              </button>
            )}
          </div>
          {imageUploadError && (
            <p className=" text-red-400">{imageUploadError}</p>
          )}
          <div className=" flex-1">
            <div className=" grid w-full h-full grid-cols-3 grid-rows-2 gap-4 p-6">
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex relative justify-between p-3 border items-center"
                  >
                    <img
                      src={url}
                      alt="listing image"
                      className=" w-full h-full bg-primaryBright object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 text-red-500 bg-primaryDark absolute right-2 top-2 rounded-lg uppercase hover:scale-105 transition-all"
                    >
                      <MdDelete size={30} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
          {loading || imagesUploading ? (
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
            <button className=" transition-all hover:scale-105 bg-primaryDark rounded-md py-3 text-primaryBright">
              Create listing
            </button>
          )}

          {error && <p className=" text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
}

export default CreateListing;
