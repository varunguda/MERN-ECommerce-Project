import React, { useEffect, useState } from 'react'

import "./Profile.css";
import { useDispatch, useSelector } from 'react-redux';
import { CiDeliveryTruck, CiHeart, CiViewList } from 'react-icons/ci';
import { PiCreditCardLight, PiHandCoinsLight, PiInfoThin, PiShoppingCartLight, PiSignOutLight, PiTicketThin, PiUserListThin } from 'react-icons/pi';
import { GoShieldLock } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router';
import Loader from '../layouts/Loader/Loader';
import PersonalInfo from './Personal Info/Personal_info';
import { loaderSpin } from '../../State/action-creators/LoaderActionCreator';


const Profile = () => {

    const { loginLoading, loggedIn, user } = useSelector(state => state.loggedIn);
    
    const navigate = useNavigate();
    const { section } = useParams();

    const [activeLocation, setActiveLocation] = useState("");

    const dispatch = useDispatch();

    useEffect(()=>{
        if(section){
            setActiveLocation(section);
        }
        else{
            setActiveLocation("");
        }
    }, [section])


    useEffect(() => {
        if (loggedIn && !loggedIn) {
            navigate("/account/login");
        }

        // eslint-disable-next-line
    }, [loggedIn]);


    const sidebarElemClickHandler = (e) => {
        let val;
        if(e.target.attributes["link-identifier"]){
            val = e.target.attributes["link-identifier"].value;
        }
        if(val){
            navigate(`/profile/${val}`);
        }
        else{
            navigate(`/profile`);
        }
    }


    return (
        <div className='profile-page-container'>
            {loginLoading ? <Loader /> : (
                <>
                    <div className="profile-sidebar">

                        <div className="main-elem">
                            <div className="main-elem-head">Hi, {user && user.name}</div>
                            <div className="main-elem-caption">Thanks for being a ManyIN customer</div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div onClick={sidebarElemClickHandler} className={`sidebar-elem ${(activeLocation === "overview") ? "active" : ""}`} link-identifier="overview"><CiViewList className='sidebar-icon' size={17} />Overview</div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">My items</div>
                            <div onClick={sidebarElemClickHandler} className={`sidebar-elem ${(activeLocation === "orders&returns") ? "active" : ""}`} link-identifier="orders&returns"><PiShoppingCartLight className='sidebar-icon' size={17} />Orders & Returns</div>
                            <div onClick={sidebarElemClickHandler} className={`sidebar-elem ${(activeLocation === "lists") ? "active" : ""}`}  link-identifier="lists"><CiHeart className='sidebar-icon' size={17}/>Lists</div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Credits</div>
                            <div onClick={sidebarElemClickHandler} className={`sidebar-elem ${(activeLocation === "coupons") ? "active" : ""}`} link-identifier="coupons"><PiTicketThin className='sidebar-icon' size={17} />Coupons</div>
                            <div onClick={sidebarElemClickHandler} className={`sidebar-elem ${(activeLocation === "savings") ? "active" : ""}`} link-identifier="savings"><PiHandCoinsLight className='sidebar-icon' size={17} />Savings</div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Manage Account</div>
                            <div onClick={sidebarElemClickHandler} className={`sidebar-elem ${(activeLocation === "") ? "active" : ""}`} link-identifier=""><PiUserListThin className='sidebar-icon' size={17} />Personal info</div>
                            <div onClick={sidebarElemClickHandler} className={`sidebar-elem ${(activeLocation === "addresses") ? "active" : ""}`} link-identifier="addresses"><CiDeliveryTruck className='sidebar-icon' size={17} />Addresses</div>
                            <div onClick={sidebarElemClickHandler} className={`sidebar-elem ${(activeLocation === "payments") ? "active" : ""}`} link-identifier="payments"><PiCreditCardLight className='sidebar-icon' size={17} />Payments</div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem-head">Legal</div>
                            <div className={`sidebar-elem ${(activeLocation === "terms") ? "active" : ""}`}><PiInfoThin className='sidebar-icon' size={17} />Terms of use</div>
                            <div className={`sidebar-elem ${(activeLocation === "privacy-policy") ? "active" : ""}`}><GoShieldLock className='sidebar-icon' size={15} />Privacy Policy</div>
                        </div>

                        <div className="sidebar-elem-section">
                            <div className="sidebar-elem"><PiSignOutLight className='sidebar-icon' size={17} />Sign out</div>
                        </div>

                    </div>


                    <div className="profile-content">
                        {(activeLocation === "overview") ? (
                            ""
                        ) : (
                            <PersonalInfo user={user} />
                        )}
                    </div>
                </>
            )}

        </div>
    )
}

export default Profile;
