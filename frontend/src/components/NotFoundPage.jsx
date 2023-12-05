import React from 'react'
import BannerPage from './layouts/Banner/BannerPage'
import { useNavigate } from 'react-router'

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <BannerPage
                imageURL={"/images/404 error lost in space.svg"}
                imageSize={400}
                caption={
                    <button className="main-btn" onClick={() => navigate("/")}>Navigate to Home !!</button>
                }
            />
        </>
    )
}

export default NotFoundPage
