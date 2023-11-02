import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CiBoxes } from 'react-icons/ci';
import { SlGraph } from 'react-icons/sl';
import { PiChatTextLight, PiUsersThreeLight } from 'react-icons/pi';
import { useLocation, useNavigate, useParams } from 'react-router';
import Loader from '../layouts/Loader/Loader';
import Metadata from '../Metadata';
import { IoIosLaptop } from 'react-icons/io';
import { BsPlusLg } from 'react-icons/bs';
import { checkAdmin } from '../../State/action-creators/AdminActionCreators';
import Dashboard from './Dashboard/Dashboard';
import AllProducts from './Product/AllProducts';
import CreateProduct from './Product/CreateProduct';
import AllOrders from './Orders/AllOrders';


const Admin = () => {

    const { checkingAdmin, isAdmin, admin } = useSelector(state => state.admin);

    const navigate = useNavigate();
    const location = useLocation();

    const [activeLocation, setActiveLocation] = useState("");

    const { section, subcategory } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (location.pathname) {
            window.scrollTo(0, 0)
        }
    }, [location.pathname]);


    useEffect(() => {
        if (section) {
            setActiveLocation(section + (subcategory ? "/" + subcategory : ""));
        }
        else {
            setActiveLocation("");
        }
    }, [section, subcategory]);


    useEffect(() => {
        if ((checkingAdmin === false) && !isAdmin) {
            navigate("/");
        }

        // eslint-disable-next-line
    }, [checkingAdmin]);


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

            {(checkingAdmin !== false) ? <Loader /> : (
                <>
                    <Metadata title={`Admin Portal - ManyIN`} />

                    <div className="profile-sidebar">

                        <div className="main-elem">
                            <div className="main-elem-head">Hi, {admin && admin.name}</div>
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
                                <PiChatTextLight strokeWidth={0} className='sidebar-icon' size={17} />
                                Reviews
                            </div>

                        </div>


                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Sellers</div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "sellers") ? "active" : ""}`}
                                link-identifier="sellers"
                            >
                                <PiUsersThreeLight className='sidebar-icon' size={17} />
                                ManyIN Sellers
                            </div>

                        </div>

                    </div>


                    <div className="profile-content">
                        {(activeLocation === "") ? (
                            <Dashboard />
                        ) : (activeLocation === "products/all") ? (
                            <AllProducts />
                        ) : (activeLocation === "products/create") ? (
                            <CreateProduct />
                        ) : (activeLocation === "orders/all") ? (
                            <AllOrders />
                        ) : (
                            <Dashboard />
                        )}
                    </div>
                </>
            )}

        </div>
    )
}

export default Admin
