import React from 'react';
import "./Navbar.css";
import { IoMdSearch } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  return (
    <navbar id="navbar">
      <div className="leftNavbar">
        <h1>Ecommerce</h1>
      </div>

      <div className="midNavbar">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/contact">Contact Us</a>
        <a href="/about">About</a>
      </div>

      <div className="rightNavbar">
        <a href="/search"><IoMdSearch /></a>
        <a href="/cart"><FaCartPlus /></a>
        <a href="/login"><CgProfile /></a>
      </div>
    </navbar>
  )
}

export default Navbar;
