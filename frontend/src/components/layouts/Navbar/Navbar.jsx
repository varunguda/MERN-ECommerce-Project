import React, { useEffect, useState } from 'react'
import './Navbar.css';
import IconCategory from '@tabler/icons-react/dist/esm/icons/IconCategory';
import IconHeart from '@tabler/icons-react/dist/esm/icons/IconHeart';
import IconCart from '@tabler/icons-react/dist/esm/icons/IconShoppingCart';
import IconUser from '@tabler/icons-react/dist/esm/icons/IconUser';
import IconUserPlus from '@tabler/icons-react/dist/esm/icons/IconUserPlus';
import IconShirt from '@tabler/icons-react/dist/esm/icons/IconShirt';
import IconChartPie from '@tabler/icons-react/dist/esm/icons/IconChartPie';
import IconMenu from '@tabler/icons-react/dist/esm/icons/IconMenu2';
import IconX from '@tabler/icons-react/dist/esm/icons/IconX';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useSelector } from 'react-redux';


const Navbar = () => {

    const { loginLoading, loggedIn, user } = useSelector(state => state.loggedIn);
    const { cartItems } = useSelector(state => state.cart);

    const [sidebar, setSidebar] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const location = useLocation();

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
                        <IconUserPlus size={17} strokeWidth={1.5} />
                        <div className='nav-elem-desc'>
                            <div className='nav-elem-small'>Sign In&nbsp;</div>
                            <div>Account</div>
                        </div>
                    </Link>
                ) : (
                    <Link to="/profile" className='nav-elems main-elem link'>
                        <IconUser strokeWidth={1.5} size={17} />
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
                        <IconCategory strokeWidth={1.25} size={20} />
                        <span>Departments</span>
                    </div>

                    <Link to="/admin" className='nav-elems link'>
                        <IconChartPie size={20} strokeWidth={1.5} />
                        <span>Portal</span>
                    </Link>

                    <Link to="/seller" className='nav-elems link'>
                        <IconShirt strokeWidth={1.5} size={17} />
                        <span>My Portal</span>
                    </Link>

                    <div className='nav-elems'>
                        <IconHeart strokeWidth={1.25} size={17} />
                        <Link to={"/profile/list"} className='nav-elem-desc link'>
                            <div className='nav-elem-small'>Order&nbsp;</div>
                            <div>My List</div>
                        </Link>
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
        ["/shipping", "/account"].every(elem => !location.pathname.includes(elem)) && (
            <>
                <nav className='parent-navbar'>
                    {isSmallScreen ?
                        (<div className={`sidebar ${sidebar ? "active" : ""}`} >
                            {sidebar ? renderSidebarContent() : ""}
                        </div>) : ""
                    }

                    <nav className="navbar">
                        <div className="navbar-logo">
                            <Link to="/" className='link logo-new'>
                                <span>
                                    ManyIN
                                </span>
                                <img src="/ManyIN_LOGO.png" alt="logo" />
                            </Link>
                        </div>

                        <div className='menu-icon' onClick={showSidebar} >
                            {sidebar ?
                                <IconX size={25} strokeWidth={1.5} />
                                :
                                <IconMenu size={25} strokeWidth={1.5} />
                            }
                        </div>

                        <nav className={sidebar ? "navbar-menu active" : "navbar-menu"}>

                            <div className='nav-elems'>
                                <IconCategory strokeWidth={1.5} size={20} />
                                <span>Departments</span>
                            </div>

                            {(!isNaN(loginLoading) && !loginLoading) ? (
                                <>
                                    {(user && user.is_admin) && (
                                        <Link to="/admin" className='nav-elems link'>
                                            <IconChartPie strokeWidth={1.5} size={20} />
                                            <span>Portal</span>
                                        </Link>
                                    )}

                                    {(user && user.is_seller) && (
                                        <Link to="/seller" className='nav-elems link'>
                                            <IconShirt strokeWidth={1.5} size={17} />
                                            <span>My Portal</span>
                                        </Link>
                                    )}
                                </>
                            ) : (
                                ""
                            )}

                            <Link to={"/profile/list"} className='nav-elems link'>
                                <IconHeart strokeWidth={1.5} size={17} />
                                <div className='nav-elem-desc link'>
                                    <div className='nav-elem-small'>Order&nbsp;</div>
                                    <div>My List</div>
                                </div>
                            </Link>

                            {(!loggedIn) ? (
                                <Link to="/account/login" className='nav-elems main-elem link'>
                                    <IconUserPlus size={17} strokeWidth={1.5} />
                                    <div className='nav-elem-desc'>
                                        <div className='nav-elem-small'>Sign In&nbsp;</div>
                                        <div>Account</div>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/profile" className='nav-elems main-elem link'>
                                    <IconUser strokeWidth={1.5} size={17} />
                                    <div className='nav-elem-desc'>
                                        <div className='nav-elem-small'>Hi, {user.name}&nbsp;</div>
                                        <div>Account</div>
                                    </div>
                                </Link>
                            )}
                        </nav>

                        <Link to="/cart" className='nav-elems cart-icon link'>
                            <IconCart strokeWidth={1.5} size={28} />
                            <span className='cart-items'>
                                {cartItems.reduce((count, item) => { return count += item.quantity }, 0)}
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
                            <a href='mailto:manyinindia@gmail.com' className="sec-nav-elems link">Write Us</a>
                        </nav>
                    </nav>
                </nav>
            </>)
    )
}

export default Navbar
