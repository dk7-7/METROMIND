import React from 'react'
import { BrowserRouter , Route , Routes , Link} from 'react-router-dom' 
import Profile from '../Pages/Profile'
import Home from '../Pages/Home'
import Cart from '../Pages/Cart'
import About from '../Pages/About'
import './menu.css'
const Menu = () => {
  return (
    <div>
        <BrowserRouter>
        <div className="menubar">

        <div className="navlink">
          
            <Link className='link' to='/home'>Home</Link>
            <Link className='link' to='/cart'>Cart</Link>
            <Link className='link'  to='/profile'>Profile</Link>
            <Link className='link' to='/login'>Login</Link>
        </div>
        
        </div>
        <Routes>
          
        <Route element={<Home/>} path='/home'></Route>
        <Route element={<Home/>} path='/home'></Route>
        <Route element={<Profile/>} path='/profile'></Route>
        <Route element={<Cart/>} path='/cart'></Route>
        <Route element={<About/>} path='/about'></Route>
        </Routes>
 

        </BrowserRouter>
        
    </div>
  )
}

export default Menu
