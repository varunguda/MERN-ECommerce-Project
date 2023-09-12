import React, { useRef } from 'react'
import './Navbar.css';
import { TfiSearch } from "react-icons/tfi";
import { BiCategory } from "react-icons/bi";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { PiTShirt, PiGraphThin } from "react-icons/pi";

const Navbar = () => {

    const navRef = useRef();

    const toggleSearch = () => {
        navRef.current.classList.toggle("open");
    }

    return (
        <>

            <nav className="navbar">

                <h1 className="navbar-logo">
                    <div className='logo-new'>ManyIN</div>
                </h1>

                <nav className="navbar-menu">

                    <div className='nav-elems'>
                        <BiCategory size={"20px"} />
                        <span>Departments</span>
                    </div>
                    
                    <div className='nav-elems'>
                        <PiGraphThin size={"20px"} />
                        <span>Dashboard</span>
                    </div>

                    <div className='nav-elems'>
                        <PiTShirt size={"17px"} />
                        <span>My Products</span>
                    </div>

                    <div className='nav-elems'>
                        <IoIosHeartEmpty size={"17px"} />
                        <span style={{ fontSize: "smaller", fontWeight: 200 }}>Reorder<br/><span style={{ fontSize: "14px", fontWeight: 700 }}>My Items</span></span>
                    </div>

                    <div className='nav-elems'>
                        <HiOutlineUserPlus size={"17px"} />
                        <span style={{ fontSize: "smaller", fontWeight: 200 }}>Sign In<br/><span style={{ fontSize: "14px", fontWeight: 700 }}>Account</span></span>
                    </div>

                    <div className='nav-elems'>
                        <FiShoppingCart size={"25px"}/>
                        <span className='cart-items'>0</span>
                    </div>

                </nav>

            </nav>


            <nav ref={navRef} className="secondary-navbar">
                
                <input
                    type="text"
                    className="search"
                    id="search"
                    spellCheck="false"
                    placeholder="Search anything here..."
                />

                <button onClick={() => toggleSearch()} type="button" className="search-toggle" >
                    <TfiSearch color='black' size={"22px"} />
                </button>

                <nav className="secondary-navbar-menu">
                    {/* <button type="button" className="uil uil-bag active" />
                    <button type="button" className="uil uil-laptop" />
                    <button type="button" className="uil uil-envelope" /> */}
                </nav>

            </nav>
        </>
    )
}

export default Navbar
