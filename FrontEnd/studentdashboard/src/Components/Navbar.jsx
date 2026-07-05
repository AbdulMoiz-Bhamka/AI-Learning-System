// src/Components/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div>
        <nav>
            <ul>
                <li> <Link to={"/"}> Home </Link></li>
                {/* <li> <Link></Link> About</li> */}
                {/* <li>Contact</li> */}
                <li> <Link to={"/signup"}> SignUp </Link></li>
            </ul>
        </nav>
    </div>
  )
}

export default Navbar;