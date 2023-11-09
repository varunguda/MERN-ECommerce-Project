import React, { useEffect, useState } from 'react'
import './Navbar.css';

import { BiCategory } from "react-icons/bi";
import { IoIosHeartEmpty } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { HiOutlineUser, HiOutlineUserPlus } from "react-icons/hi2";
import { PiTShirt, PiGraphThin } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useSelector } from 'react-redux';


const Navbar = () => {

    const { loginLoading, loggedIn, user } = useSelector(state => state.loggedIn);
    const { cartItems } = useSelector(state => state.cart);

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
                {(!loggedIn) ? (
                    <Link to="/account/login" className='nav-elems main-elem link'>
                        <HiOutlineUserPlus size={"17px"} />
                        <div className='nav-elem-desc'>
                            <div className='nav-elem-small'>Sign In&nbsp;</div>
                            <div>Account</div>
                        </div>
                    </Link>
                ) : (
                    <Link to="/profile" className='nav-elems main-elem link'>
                        <HiOutlineUser size={"17px"} />
                        <div className='nav-elem-desc'>
                            <div className='nav-elem-small'>Hi, {user.name}&nbsp;</div>
                            <div>Account</div>
                        </div>
                    </Link>
                )}
            </div>

            <div className="scrollable">

                <nav className={sidebar ? "navbar-menu active" : "navbar-menu"}>
                    <div className='nav-elems'>
                        <BiCategory size={"20px"} />
                        <span>Departments</span>
                    </div>

                    <Link to="/admin" className='nav-elems link'>
                        <PiGraphThin size={"20px"} />
                        <span>Portal</span>
                    </Link>

                    <div className='nav-elems'>
                        <PiTShirt size={"17px"} />
                        <span>My Products</span>
                    </div>

                    <div className='nav-elems'>
                        <IoIosHeartEmpty size={"17px"} />
                        <div className='nav-elem-desc'>
                            <div className='nav-elem-small'>Order&nbsp;</div>
                            <div>My List</div>
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

                {isSmallScreen ?
                    (
                        <div className={`sidebar ${sidebar ? "active" : ""}`} >
                            {sidebar ? renderSidebarContent() : ""}
                        </div>

                    ) : ""
                }

                <nav className="navbar">

                    <h1 className="navbar-logo">
                        <Link to="/" className='link logo-new'>
                            <span>
                                ManyIN
                            </span>
                            <img src="/ManyIN_LOGO.png" alt="logo" />
                        </Link>
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

                        {(!isNaN(loginLoading) && !loginLoading) ? (
                            <>
                                {(user && user.is_admin) && (
                                    <Link to="/admin" className='nav-elems link'>
                                        <PiGraphThin size={"20px"} />
                                        <span>Portal</span>
                                    </Link>
                                )}

                                {(user && user.is_seller) && (
                                    <div className='nav-elems'>
                                        <PiTShirt size={"17px"} />
                                        <span>My Products</span>
                                    </div>
                                )}
                            </>
                        ) : (
                            ""
                        )}

                        <Link to={"/profile/list"} className='nav-elems link'>
                            <IoIosHeartEmpty size={"17px"} />
                            <div className='nav-elem-desc'>
                                <div className='nav-elem-small'>Order&nbsp;</div>
                                <div>My List</div>
                            </div>
                        </Link>

                        {(!loggedIn) ? (
                            <Link to="/account/login" className='nav-elems main-elem link'>
                                <HiOutlineUserPlus size={"17px"} />
                                <div className='nav-elem-desc'>
                                    <div className='nav-elem-small'>Sign In&nbsp;</div>
                                    <div>Account</div>
                                </div>
                            </Link>
                        ) : (
                            <Link to="/profile" className='nav-elems main-elem link'>
                                <HiOutlineUser size={"17px"} />
                                <div className='nav-elem-desc'>
                                    <div className='nav-elem-small'>Hi, {user.name}&nbsp;</div>
                                    <div>Account</div>
                                </div>
                            </Link>
                        )}

                    </nav>

                    <Link to="/cart" className='nav-elems cart-icon link'>
                        <FiShoppingCart size={"25px"} />
                        <span className='cart-items'>
                            {cartItems.reduce((count, item) => { return count += item.quantity}, 0)}
                        </span>
                    </Link>

                </nav>


                <nav className="secondary-navbar">

                    <SearchBar />

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
