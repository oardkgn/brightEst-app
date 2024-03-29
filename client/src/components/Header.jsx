import {useState, useEffect} from 'react'
import { IoIosSearch } from "react-icons/io";
import { LuMenu } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function Header() {

  const {currentUser} = useSelector((state) => state.user )
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    
  }, [location.search]);

  return (
    <header className="bg-secondaryBright w-screen  border-b-2 p-1 pb-[6px] shadow-lg">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-10 md:px-14 flex justify-between items-center">
          <Link to="/">
            <img className="md:min-w-32 md:max-w-32 min-w-24 max-w-24" src="./public/BrightEstD.png" alt="logo" />
          </Link>
          <div className=" flex w-full justify-end md:gap-8 gap-2 items-center">
          <form onSubmit={handleSubmit} className=" relative w-full lg:w-96 ml-3 md:ml-8 flex items-center">
            <input value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value)}} className=" bg-primaryBright hidden md:block p-2 w-full outline-none rounded-md" placeholder="Search..." type="text" name="" id="" />
            <button className=' p-1 absolute right-1 hidden md:block hover:scale-125 transition-all'><IoIosSearch size={24} color="#222831" className="" /></button>
          </form>
          <div className=" w-[2px] h-10 hidden md:block bg-primaryDark rounded-full"></div>
         
          <div className=" flex gap-3 items-center">
            <Link className=" p-2 text-xl hover:scale-110 hidden md:block none transition-all hover:text-primaryColor text-primaryDark" to="/home">Home</Link>
            <Link className=" p-2 text-xl hover:scale-110 hidden md:block none transition-all hover:text-primaryColor text-primaryDark" to="/about">About</Link>
            {currentUser ? (
              <Link to="/profile"><img className='rounded-full min-w-11 min-h-11 max-w-11 max-h-11 object-cover' src={currentUser.avatar} alt='profile'/></Link>
            ) : (
              <Link className=" p-2 text-sm md:text-xl hover:scale-110 transition-all hover:text-primaryColor text-primaryBright px-6 bg-secondaryDark rounded-md" to="/login">Login</Link>
            )}
          </div>
          <LuMenu className=' w-24 h-12 md:hidden' color='#222831' />
          </div>
        </div>
      </header>
  )
}

export default Header