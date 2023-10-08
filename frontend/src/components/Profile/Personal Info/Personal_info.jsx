import React from 'react';

import "./Personal_info.css";

const PersonalInfo = ({ user }) => {
    return (
        <div className="profile-page-content">

            <div className="profile-page-head">Personal info</div>

            <div className="personal-info-container">
                <div className="info-head">
                    Your personal information
                </div>

                <section>
                    <span className='inferior-btn'>Edit</span>
                    <div className="section-head">Name</div>
                    <div className="section-content">{user && user.name}</div>
                </section>

                <section>
                    <span className='inferior-btn'>Edit</span>
                    <div className="section-head">Email address</div>
                    <div className="section-content">{user && user.email}</div>
                </section>

                <section>
                    <span className='inferior-btn'>{(user && user.mobile) ? "Edit" : "Add"}</span>
                    <div className="section-head">Phone Number</div>
                    <div className="section-content">{(user && user.mobile) ? user.mobile : "Add phone number"}</div>
                </section>

                <section>
                    <span className='inferior-btn'>Edit</span>
                    <div className="section-head">Password</div>
                    <div className="section-content">•••••••••••••</div>
                </section>
            </div>
        </div>
    )
}

export default PersonalInfo
