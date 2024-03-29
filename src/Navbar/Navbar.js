// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css"

function Navbar() {
  return (
    <div className="div">
      <div className="div-2">The NightOwl</div>
      <div className="div-3">
        <Link to="/" className="nav-link">
          
        </Link>
        <Link to="/podcast/:id" className="nav-link">
          
        </Link>
        <Link to="/favorites" className="nav-link">
          Favourites
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
