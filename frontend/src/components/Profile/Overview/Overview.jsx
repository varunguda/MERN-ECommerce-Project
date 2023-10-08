import React from 'react';
import { Link } from "react-router-dom";
import {BsTruck} from "react-icons/bs";
import {FiHeart} from "react-icons/fi";
import {LiaEdit} from "react-icons/lia";
import {MdOutlineAddLocationAlt} from "react-icons/md";
import OverviewCard from './OverviewCard';

import "./Overview.css";
import { PiTicketLight } from 'react-icons/pi';


const Overview = ({ user }) => {

    return (
        <div className="overview-container">
            <div className="profile-page-head">Welcome to your Account</div>

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
                    icon={<BsTruck size={50} />} 
                    caption="Check your order status" 
                />
                <OverviewCard 
                    head="Addresses" 
                    icon={<MdOutlineAddLocationAlt size={50} />} 
                    caption="Save addresses for a hassle-free checkout" 
                    linkTo={"/profile/addresses"}
                />
                <OverviewCard 
                    head="Wishlist" 
                    icon={<FiHeart strokeWidth={1.5} size={50} />} 
                    caption="All your curated products" 
                    linkTo={"/profile/lists"}
                />
                <OverviewCard 
                    head="Coupons" 
                    icon={<PiTicketLight size={50} />} 
                    caption="Manage coupons for additional discounts" 
                    linkTo={"/profile/coupons"}
                />
                <OverviewCard 
                    head="Profile Details" 
                    icon={<LiaEdit size={50} />} 
                    caption="Change your profile details"
                    linkTo={"/profile/personal"} 
                />
            </div>
        </div>
    )
}

export default Overview
