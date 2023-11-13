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
import Dashboard from './Dashboard/Dashboard';
import { checkSeller } from '../../State/action-creators/SellerActionCreators';


const Sellers = () => {

    const { checkingSeller, isSeller, seller } = useSelector(state => state.seller);

    const navigate = useNavigate();
    const location = useLocation();

    const [activeLocation, setActiveLocation] = useState("");

    const { section, subcategory } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkSeller());
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
        if ((checkingSeller === false) && !isSeller) {
            navigate("/");
        }
        // eslint-disable-next-line
    }, [checkingSeller]);


    const sidebarElemClickHandler = (e) => {
        let val;
        if (e.target.attributes["link-identifier"]) {
            val = e.target.attributes["link-identifier"].value;
        }
        if (val) {
            navigate(`/seller/${val}`);
        }
        else {
            navigate(`/seller`);
        }
    }


    return (
        <div className='page-container'>

            {(checkingSeller !== false) ? <Loader /> : (

                (isSeller && (
                    <>
                        <Metadata title="Seller Portal - ManyIN" />

                        <div className="profile-sidebar">

                            <div className="main-elem">
                                <div className="main-elem-head">Hi, {seller && seller.name}</div>
                                <div className="main-elem-caption">Welcome to Seller's Portal</div>
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
                                <Dashboard />
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

export default Sellers;