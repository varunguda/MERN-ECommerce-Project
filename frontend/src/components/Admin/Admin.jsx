import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CiBoxes } from 'react-icons/ci';
import { SlGraph } from 'react-icons/sl';
import { VscPreview } from 'react-icons/vsc';
import { PiUsersThreeLight } from 'react-icons/pi';
import { useLocation, useNavigate, useParams } from 'react-router';
import Loader from '../layouts/Loader/Loader';
import Metadata from '../Metadata';
import { IoIosLaptop } from 'react-icons/io';
import { BsPlusLg } from 'react-icons/bs';


const Admin = () => {

    const { loginLoading, loggedIn, user } = useSelector(state => state.loggedIn);

    const navigate = useNavigate();
    const location = useLocation();

    const [activeLocation, setActiveLocation] = useState("");

    const { section, subcategory } = useParams();

    useEffect(() => {
        if (location.pathname) {
            window.scrollTo(0, 0)
        }
    }, [location.pathname]);


    useEffect(() => {
        if (section) {
            setActiveLocation(section+(subcategory ? "/" + subcategory : ""));
        }
        else {
            setActiveLocation("");
        }
    }, [section, subcategory]);


    useEffect(() => {
        console.log(activeLocation);
    }, [activeLocation])


    useEffect(() => {
        if (!isNaN(loginLoading) && !loginLoading && !loggedIn) {
            navigate("/account/login");
        }

        // eslint-disable-next-line
    }, [loginLoading, loggedIn]);


    const sidebarElemClickHandler = (e) => {
        let val;
        if (e.target.attributes["link-identifier"]) {
            val = e.target.attributes["link-identifier"].value;
        }
        if (val) {
            navigate(`/admin/${val}`);
        }
        else {
            navigate(`/admin`);
        }
    }

    return (
        <div className='page-container'>

            {loginLoading ? <Loader /> : (
                <>
                    <Metadata title={`${user.name}'s profile - ManyIN`} />

                    <div className="profile-sidebar">

                        <div className="main-elem">
                            <div className="main-elem-head">Hi, {user && user.name}</div>
                            <div className="main-elem-caption">Welcome to Admin's Portal</div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "") ? "active" : ""}`}
                                link-identifier=""
                            >
                                <SlGraph className='sidebar-icon' size={17} />
                                Dashboard
                            </div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Products</div>
                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "products/all") ? "active" : ""}`}
                                link-identifier="products/all"
                            >
                                <IoIosLaptop className='sidebar-icon' size={17} />
                                All Products
                            </div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "products/create") ? "active" : ""}`}
                                link-identifier="products/create"
                            >
                                <BsPlusLg className='sidebar-icon' size={17} />
                                Create
                            </div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Orders</div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "orders/all") ? "active" : ""}`}
                                link-identifier="orders/all"
                            >
                                <CiBoxes className='sidebar-icon' size={17} />
                                All Orders
                            </div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Users</div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "users") ? "active" : ""}`}
                                link-identifier="users"
                            >
                                <PiUsersThreeLight className='sidebar-icon' size={17} />
                                ManyIN Users
                            </div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "reviews") ? "active" : ""}`}
                                link-identifier="reviews"
                            >
                                <VscPreview strokeWidth={0} className='sidebar-icon' size={17} />
                                Reviews
                            </div>

                        </div>

                    </div>


                    <div className="profile-content">
                        M
                    </div>
                </>
            )}

        </div>
    )
}

export default Admin
