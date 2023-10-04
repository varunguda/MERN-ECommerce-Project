import React from 'react';

import "./BannerPage.css";

const BannerPage = ({ imageURL, caption }) => {
  return (
    <div className='banner-page-container'>
        <div>
            <img src={imageURL} alt="banner-page-img" />
            <div className="banner-page-caption">{caption}</div>
        </div>
    </div>
  )
}

export default BannerPage
