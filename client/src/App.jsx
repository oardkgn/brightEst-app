import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Header from './components/Header'
import About from './pages/About'
import PrivateRoute from './components/PrivateRoute'

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
       <Route element={<PrivateRoute />}>
       <Route path='/profile' element={<Profile />}/>
       </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
