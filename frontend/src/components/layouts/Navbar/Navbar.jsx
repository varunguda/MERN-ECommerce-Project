import React, { useEffect, useState } from 'react'
import './Navbar.css';

import { TfiSearch } from "react-icons/tfi";
import { BiCategory } from "react-icons/bi";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { PiTShirt, PiGraphThin } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";

const Navbar = () => {

    const [sidebar, setSidebar] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {

        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 960);
        }

        checkScreenSize();

        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);

    }, []);

    const showSidebar = () => setSidebar(!sidebar);

    const renderSidebarContent = () => (
        <>
            <div className='fixed'>
                <div className='nav-elems main-elem'>
                    <HiOutlineUserPlus size={"17px"} />
                    <div className='nav-elem-desc'>
                        <div className='nav-elem-small'>Sign In&nbsp;</div>
                        <div>Account</div>
                    </div>
                </div>
            </div>

            <div className="scrollable">

                <nav className={sidebar ? "navbar-menu active" : "navbar-menu"}>
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
                        <div className='nav-elem-desc'>
                            <div className='nav-elem-small'>Reorder&nbsp;</div>
                            <div>My Items</div>
                        </div>
                    </div>

                </nav>

                <nav className={sidebar ? "secondary-navbar-menu active" : "secondary-navbar-menu"}>
                    <div className="sec-nav-elems">Deals</div>
                    <div className="sec-nav-elems">ManyIN Trending</div>
                    <div className="sec-nav-elems">Electronics</div>
                    <div className="sec-nav-elems">Fashion</div>
                    <div className="sec-nav-elems">Home</div>
                    <div className="sec-nav-elems">Beauty</div>
                    <div className="sec-nav-elems">Write Us</div>
                </nav>

            </div>
        </>
    )


    return (
        <>
            <nav className='parent-navbar'>

                {
                    isSmallScreen ?
                        (
                            <div className={`sidebar ${sidebar ? "active" : ""}`} >
                                {sidebar ? renderSidebarContent() : ""}
                            </div>

                        ) : ""
                }

                <nav className="navbar">

                    <h1 className="navbar-logo">
                        <div className='logo-new'>ManyIN</div>
                    </h1>

                    <div className='menu-icon' onClick={showSidebar} >
                        {sidebar ?
                            <MdClose size={"20px"} />
                            :
                            <RxHamburgerMenu size={"20px"} color='white' />
                        }
                    </div>

                    <nav className={sidebar ? "navbar-menu active" : "navbar-menu"}>

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
                            <div className='nav-elem-desc'>
                                <div className='nav-elem-small'>Reorder&nbsp;</div>
                                <div>My Items</div>
                            </div>
                        </div>

                        <div className='nav-elems main-elem'>
                            <HiOutlineUserPlus size={"17px"} />
                            <div className='nav-elem-desc'>
                                <div className='nav-elem-small'>Sign In&nbsp;</div>
                                <div>Account</div>
                            </div>
                        </div>

                    </nav>

                    <div className='nav-elems cart-icon'>
                        <FiShoppingCart size={"25px"} />
                        <span className='cart-items'>0</span>
                    </div>

                </nav>


                <nav className="secondary-navbar">

                    <input
                        type="text"
                        className="search"
                        id="search"
                        spellCheck="false"
                        placeholder="Search anything here..."
                    />

                    <button type="button" className="search-toggle" >
                        <TfiSearch color='black' size={"22px"} />
                    </button>

                    <nav className={sidebar ? "secondary-navbar-menu active" : "secondary-navbar-menu"}>
                        <div className="sec-nav-elems">Deals</div>
                        <div className="sec-nav-elems">ManyIN Trending</div>
                        <div className="sec-nav-elems">Electronics</div>
                        <div className="sec-nav-elems">Fashion</div>
                        <div className="sec-nav-elems">Home</div>
                        <div className="sec-nav-elems">Beauty</div>
                        <div className="sec-nav-elems">Write Us</div>
                    </nav>

                </nav>
            </nav>

        </>
    )
}

export default Navbar
