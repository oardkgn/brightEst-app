import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaAngleRight,
  FaAngleLeft,
  FaWifi,
  FaShieldAlt,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import { TbToolsKitchen2 } from "react-icons/tb";
import { MdLiving } from "react-icons/md";
import Contact from "../components/Contact";

function Listing() {
  const params = useParams();
  const [error, setError] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        const user = await fetch(`/api/user/${currentUser._id}`);
        const userData = await user.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setError(false);
        setLiked(userData.tracking.includes(params.id));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);

  console.log(liked);

  const likeListing = async() => {
    if (!liked) {
      try {
        const res = await fetch(`/api/user/like/${params.id}`,{
          method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id : currentUser._id
        }),
        })
        setLiked(true)
      } catch (error) {
        console.log(error);
      }
    }else{
      try {
        const res = await fetch(`/api/user/likes/delete/${params.id}`,{
          method: "DELETE",
        })
        setLiked(false)
      } catch (error) {
        console.log(error);
      }
    }
  }

  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <div>
      {loading && (
        <div className=" flex items-center justify-center w-full h-screen">
          <img src="loading-gif.gif" />
          Loading...
        </div>
      )}
      {error && (
        <div className=" flex items-center justify-center w-full h-screen">
          {error}
        </div>
      )}
      {listing && !loading && !error && (
        <div className=" max-w-[1600px] relative mx-auto">
          <Swiper className=" relative" ref={sliderRef}>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
            <div
              className="prev-arrow p-2 bg-primaryBright z-20 text-primaryColor rounded-full cursor-pointer absolute left-10 top-1/2  -translate-y-1/2"
              onClick={handlePrev}
            >
              <FaAngleLeft size={30} />
            </div>
            <div
              className="next-arrow p-2 bg-primaryBright z-20 text-primaryColor rounded-full cursor-pointer absolute right-10 top-1/2  -translate-y-1/2"
              onClick={handleNext}
            >
              <FaAngleRight size={30} />
            </div>
          </Swiper>
          <div className="absolute top-4 hover:scale-105 transition-all right-4 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          <div className="absolute top-4 hover:scale-105 transition-all right-20 z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            {liked ? (
              <FaHeart className="text-slate-500" onClick={likeListing} />
            ) : (
              <FaRegHeart className="text-slate-500" onClick={likeListing} />
            )}
          </div>
          {copied && (
            <p className="absolute top-20  right-4 z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountedPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountedPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.rooms.bedrooms > 1
                  ? `${listing.rooms.bedrooms} bedrooms `
                  : `${listing.rooms.bedrooms} bedroom `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.rooms.bathrooms > 1
                  ? `${listing.rooms.bathrooms} bathrooms `
                  : `${listing.rooms.bathrooms} bathroom `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <TbToolsKitchen2 className="text-lg" />
                {listing.rooms.kitchens > 1
                  ? `${listing.rooms.kitchens} kitchens `
                  : `${listing.rooms.kitchens} kithen `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <MdLiving className="text-lg" />
                {listing.rooms.livingrooms > 1
                  ? `${listing.rooms.bathrooms} living rooms `
                  : `${listing.rooms.bathrooms} living room `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.attributes.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.attributes.furnished ? "Furnished" : "Unfurnished"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaWifi className="text-lg" />
                {listing.attributes.wifi ? "Has Wifi" : "No Wifi"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaShieldAlt className="text-lg" />
                {listing.attributes.security ? "Has Security" : "No Security"}
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase transition-all hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact setContact={setContact} listing={listing} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Listing;
