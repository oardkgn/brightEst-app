import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Header from './components/Header'
import About from './pages/About'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'

function App() {
  return (
  <BrowserRouter>
    <Header />
    <Routes>
       <Route path='/' element={<Home />}/>
       <Route path='/home' element={<Home />}/>
       <Route path='/about' element={<About />}/>
       <Route path='/login' element={<Login />}/>
       <Route path='/signUp' element={<Register />}/>
       <Route path='/search' element={<Search />}/>
       <Route path='/listing/:id' element={<Listing />}/>
       <Route element={<PrivateRoute />}>
       <Route path='/profile' element={<Profile />}/>
       <Route path='/create-listing' element={<CreateListing />}/>
       <Route path='/update-listing/:id' element={<UpdateListing />}/>
       </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
