import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {PiSignOutBold} from "react-icons/pi";
import OverviewCard from './OverviewCard';
import { useDispatch, useSelector } from 'react-redux';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { toast } from 'react-toastify';
import { closeModal, openModal } from '../../../State/action-creators/ModalActionCreator';
import { loadUser, signOutUser } from '../../../State/action-creators/UserActionCreators';
import { SIGNOUT_USER_RESET } from '../../../State/constants/UserConstants';

import "./Overview.css";


const Overview = ({ user }) => {

    const { signOutLoading, signedOut, signOutMessage, signOutError } = useSelector(state => state.signout);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(()=>{
        if(signOutLoading && signOutLoading === true){
            dispatch(loaderSpin(true));
        }
        else {
            dispatch(loaderSpin(false));
        }

        // eslint-disable-next-line
    }, [signOutLoading]);


    useEffect(()=>{
        toast.error(signOutError, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [signOutError])


    useEffect(()=>{
        if(signOutMessage){
            toast.success(signOutMessage, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }, [signOutMessage])


    useEffect(()=>{
        if(signedOut){
            navigate("/");
            dispatch({ type: SIGNOUT_USER_RESET });
            dispatch(loadUser());
        }

        // eslint-disable-next-line
    }, [signedOut])
    

    const signOutClickHandler = (e) => {
        dispatch(openModal(
            "Are you sure you want to Sign out?",
            (<>
                <div className="modal-caption">You need your Email & Password to log back in again</div>

                <div className="modal-btn-container">
                    <button onClick={()=> (dispatch(closeModal()))} className='secondary-btn'>No</button>
                    <button onClick={signOutHandler} className='main-btn warning'>Yes</button>
                </div>
            </>)
        ));
    }


    const signOutHandler = () => {
        dispatch(closeModal());
        dispatch(signOutUser());
    }


    return (
        <div className="overview-container">
            <div className="page-head">Welcome to your Account</div>

            <div className="user-details-container">
                <img 
                    src={(user && user.avatar) ? user.avatar.url : "/images/profileplaceholder.png"} 
                    alt="user" 
                />
                <div className="user-info">
                    <div className="user-name">{user && user.name}</div>
                    <div className="user-email">{user && user.email}</div>
                </div>

                <Link to="/profile/personal" className="link">
                    <span className='inferior-btn'>View profile</span>
                </Link>
            </div>

            <div className="overview-card-container">
                <OverviewCard 
                    head="Orders" 
                    img="./images/orders.svg"
                    caption="Check your order status" 
                />
                <OverviewCard 
                    head="Addresses" 
                    img="./images/delivery_address.svg"
                    caption="Save addresses for a hassle-free checkout" 
                    linkTo={"/profile/addresses"}
                />
                <OverviewCard 
                    head="Wishlist" 
                    img="./images/wishlist.svg"
                    caption="All your curated products" 
                    linkTo={"/profile/lists"}
                />
                <OverviewCard 
                    head="Coupons" 
                    img="./images/coupons.svg"
                    caption="Manage coupons for additional discounts" 
                    linkTo={"/profile/coupons"}
                />
                <OverviewCard 
                    head="Profile Details" 
                    img="./images/profile.svg"
                    caption="Change your profile details"
                    linkTo={"/profile/personal"} 
                />
            </div>

            <div className="overview-btn-container">
                <button onClick={signOutClickHandler} className="main-btn warning"><PiSignOutBold size={20}/>Sign Out</button>
            </div>
        </div>
    )
}

export default Overview
