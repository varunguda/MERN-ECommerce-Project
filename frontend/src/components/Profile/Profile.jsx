import React, { useContext, useEffect, useState } from 'react'

import "./Profile.css";
import { useDispatch, useSelector } from 'react-redux';
import { CiDeliveryTruck, CiHeart, CiViewList } from 'react-icons/ci';
import { PiHandCoinsLight, PiInfoThin, PiShoppingCartLight, PiSignOutLight, PiTicketThin, PiUserListThin } from 'react-icons/pi';
import { GoShieldLock } from 'react-icons/go';
import { useLocation, useNavigate, useParams } from 'react-router';
import Loader from '../layouts/Loader/Loader';
import PersonalInfo from './Personal Info/Personal_info';
import Overview from './Overview/Overview';
import Addresses from './Addresses/Addresses';
import Orders from './Orders/Orders';
import Metadata from '../Metadata';
import Terms from './Legal/Terms';
import Privacy from './Legal/Privacy';
import { ModalContext } from '../../Context/ModalContext';
import { loadUser, signOutUser } from '../../State/action-creators/UserActionCreators';
import { SIGNOUT_USER_RESET } from '../../State/constants/UserConstants';


const Profile = () => {

    const { loginLoading, loggedIn, user } = useSelector(state => state.loggedIn);
    const { signedOut } = useSelector(state => state.signout);

    const { openModal, closeModal } = useContext(ModalContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { section } = useParams();

    const [activeLocation, setActiveLocation] = useState("");

    useEffect(() => {
        if (location.pathname) {
            window.scrollTo(0, 0)
        }
    }, [location.pathname]);


    useEffect(() => {
        if (section) {
            setActiveLocation(section);
        }
        else {
            setActiveLocation("");
        }
    }, [section]);


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
            navigate(`/profile/${val}`);
        }
        else {
            navigate(`/profile`);
        }
    }


    useEffect(() => {
        if (signedOut) {
            navigate("/");
            dispatch({ type: SIGNOUT_USER_RESET });
            dispatch(loadUser());
        }

        // eslint-disable-next-line
    }, [signedOut])


    const signOutClickHandler = (e) => {
        openModal(
            "Are you sure you want to Sign out?",
            (<>
                <div className="modal-caption">You need your Email & Password to log back in again</div>

                <div className="modal-btn-container">
                    <button onClick={closeModal} className='secondary-btn'>No</button>
                    <button onClick={() => {
                        closeModal();
                        dispatch(signOutUser());
                    }} className='main-btn warning'>Yes</button>
                </div>
            </>)
        );
    }


    return (
        <div className='page-container'>

            {loginLoading ? <Loader /> : (
                <>
                    <Metadata title={`${user.name}'s profile - ManyIN`} />

                    <div className="profile-sidebar">

                        <div className="main-elem">
                            <div className="main-elem-head">Hi, {user && user.name}</div>
                            <div className="main-elem-caption">Thanks for being a ManyIN customer</div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "") ? "active" : ""}`}
                                link-identifier=""
                            >
                                <CiViewList className='sidebar-icon' size={17} />
                                Overview
                            </div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">My items</div>
                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "orders") ? "active" : ""}`}
                                link-identifier="orders"
                            >
                                <PiShoppingCartLight className='sidebar-icon' size={17} />
                                Orders
                            </div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "lists") ? "active" : ""}`}
                                link-identifier="lists"
                            >
                                <CiHeart className='sidebar-icon' size={17} />
                                Lists
                            </div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Credits</div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "coupons") ? "active" : ""}`}
                                link-identifier="coupons"
                            >
                                <PiTicketThin className='sidebar-icon' size={17} />
                                Coupons
                            </div>
                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "savings") ? "active" : ""}`}
                                link-identifier="savings"
                            >
                                <PiHandCoinsLight className='sidebar-icon' size={17} />
                                Savings

                            </div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Manage Account</div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "personal") ? "active" : ""}`}
                                link-identifier="personal"
                            >
                                <PiUserListThin className='sidebar-icon' size={17} />
                                Personal info
                            </div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "addresses") ? "active" : ""}`}
                                link-identifier="addresses"
                            >
                                <CiDeliveryTruck className='sidebar-icon' size={17} />
                                Addresses
                            </div>

                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Legal</div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "terms") ? "active" : ""}`}
                                link-identifier="terms"
                            >
                                <PiInfoThin className='sidebar-icon' size={17} />
                                Terms of use
                            </div>

                            <div
                                onClick={sidebarElemClickHandler}
                                className={`sidebar-elem ${(activeLocation === "privacy") ? "active" : ""}`}
                                link-identifier="privacy"
                            >
                                <GoShieldLock className='sidebar-icon' size={15} />
                                Privacy Policy
                            </div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div onClick={signOutClickHandler} className="sidebar-elem"><PiSignOutLight className='sidebar-icon' size={17} />Sign out</div>
                        </div>

                    </div>


                    <div className="profile-content">
                        {(activeLocation === "") ? (
                            <Overview user={user} />
                        ) :(activeLocation === "personal") ? (
                            <PersonalInfo user={user} />
                        ) : (activeLocation === "addresses") ? (
                            <Addresses />
                        ) : (activeLocation === "orders") ? (
                            <Orders />
                        ) : (activeLocation === "terms") ? (
                            <Terms />
                        ) : (activeLocation === "privacy") ? (
                            <Privacy />
                        ) : (
                            ""
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default Profile;
