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
                        <div onClick={onClick} class="letter-image">
                            <div class="animated-mail">
                                <div class="back-fold"></div>
                                <div class="letter">
                                    <div class="letter-border"></div>
                                    <div class="letter-title"></div>
                                    <div class="letter-context"></div>
                                    <div className="letter-content">{letterContent ? letterContent : ""}</div>
                                    <div class="letter-stamp">
                                        <div class="letter-stamp-inner"></div>
                                    </div>
                                </div>
                                <div class="top-fold"></div>
                                <div class="body"></div>
                                <div class="left-fold"></div>
                            </div>
                            <div class="shadow"></div>
                        </div>

                    ) : (

                        (type === "done") ? (

                            <div class="wrapper">
                                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> 
                                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
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
