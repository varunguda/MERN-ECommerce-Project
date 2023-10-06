import React from 'react';

import "./BannerPage.css";

const BannerPage = ({ imageURL, caption, letterContent, onClick, type }) => {
    return (
        <div className='banner-page-container'>
            <div>
                {imageURL ? (

                    <img src={imageURL} alt="banner-page-img" />

                ) : (
                    (type === "mail") ? (
                        <div onClick={onClick} className="letter-image">
                            <div className="animated-mail">
                                <div className="back-fold"></div>
                                <div className="letter">
                                    <div className="letter-border"></div>
                                    <div className="letter-title"></div>
                                    <div className="letter-context"></div>
                                    <div className="letter-content">{letterContent ? letterContent : ""}</div>
                                    <div className="letter-stamp">
                                        <div className="letter-stamp-inner"></div>
                                    </div>
                                </div>
                                <div className="top-fold"></div>
                                <div className="body"></div>
                                <div className="left-fold"></div>
                            </div>
                            <div className="shadow"></div>
                        </div>

                    ) : (

                        (type === "done") ? (

                            <div className="wrapper">
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> 
                                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                            </div>
                        ) : (
                            ""
                        )
                    )
                )}
                <div className="banner-page-caption">{caption}</div>
            </div>
        </div>
    )
}

export default BannerPage
