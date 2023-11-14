import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconPackages from '@tabler/icons-react/dist/esm/icons/IconPackages';
import IconChartLine from '@tabler/icons-react/dist/esm/icons/IconChartLine';
import IconUsersGroup from '@tabler/icons-react/dist/esm/icons/IconUsersGroup';
import IconUsers from '@tabler/icons-react/dist/esm/icons/IconUsers';
import IconDevices from '@tabler/icons-react/dist/esm/icons/IconDevices';
import IconPlus from '@tabler/icons-react/dist/esm/icons/IconPlus';
import { useLocation, useNavigate, useParams } from 'react-router';
import Loader from '../layouts/Loader/Loader';
import Metadata from '../Metadata';
import { checkAdmin } from '../../State/action-creators/AdminActionCreators';
import Dashboard from './Dashboard/Dashboard';
import AllProducts from './Product/AllProducts';
import CreateProduct from './Product/CreateProduct';
import AllOrders from './Orders/AllOrders';
import AllUsers from './Users/AllUsers';
import AllSellers from './Sellers/AllSellers';


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
            window.scrollTo(0, 0);
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

                (isAdmin && (
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
                                    <IconChartLine className='sidebar-icon' size={17} strokeWidth={1.25} />
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
                                    <IconDevices className='sidebar-icon' size={17} strokeWidth={1.25} />
                                    All Products
                                </div>

                                <div
                                    onClick={sidebarElemClickHandler}
                                    className={`sidebar-elem ${(activeLocation === "products/create") ? "active" : ""}`}
                                    link-identifier="products/create"
                                >
                                    <IconPlus className='sidebar-icon' size={17} strokeWidth={1.25} />
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
                                    <IconPackages className='sidebar-icon' size={17} strokeWidth={1} />
                                    All Orders
                                </div>
                            </div>

                            <div className="sidebar-elem-section">
                                <div className="sidebar-elem-head">Users</div>

                                <div
                                    onClick={sidebarElemClickHandler}
                                    className={`sidebar-elem ${(activeLocation === "customers") ? "active" : ""}`}
                                    link-identifier="customers"
                                >
                                    <IconUsersGroup className='sidebar-icon' size={17} strokeWidth={1.25} />
                                    ManyIN Customers
                                </div>
                            </div>


                            <div className="sidebar-elem-section">
                                <div className="sidebar-elem-head">Sellers</div>

                                <div
                                    onClick={sidebarElemClickHandler}
                                    className={`sidebar-elem ${(activeLocation === "sellers") ? "active" : ""}`}
                                    link-identifier="sellers"
                                >
                                    <IconUsers className='sidebar-icon' size={17} strokeWidth={1.25} />
                                    ManyIN Sellers
                                </div>

                            </div>

                        </div>


                        <div className="profile-content">
                            {(activeLocation === "") ? (
                                <Dashboard user={admin} />
                            ) : (activeLocation === "products/all") ? (
                                <AllProducts />
                            ) : (activeLocation === "products/create") ? (
                                <CreateProduct />
                            ) : (activeLocation === "orders/all") ? (
                                <AllOrders />
                            ) : (activeLocation === "customers") ? (
                                <AllUsers />
                            ) : (activeLocation === "sellers") ? (
                                <AllSellers />
                            ) : (
                                ""
                                // <Dashboard /> 
                            )}
                        </div>
                    </>
                ))
            )}
        </div>
    )
}

export default Admin;