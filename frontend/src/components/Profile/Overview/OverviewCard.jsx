import React from 'react'
import { Link } from 'react-router-dom'

const OverviewCard = ({ icon, head, caption, linkTo }) => {
    return (
        <>
            {(linkTo) ? (
                <Link to={linkTo} className='link overview-card'>
                    <div className='overview-card-content'>
                        {icon ? icon : ""}
                        <div className='overview-card-head'>{head}</div>
                        <span>{caption}</span>
                    </div>
                </Link>
            ) : (
                <div className='overview-card'>
                    <div className='overview-card-content'>
                        {icon ? icon : ""}
                        <div className='overview-card-head'>{head}</div>
                        <span>{caption}</span>
                    </div>
                </div>
            )}
        </>
    )
}

export default OverviewCard
