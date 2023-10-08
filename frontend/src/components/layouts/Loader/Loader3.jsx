import React from 'react';

import "./Loader3.css";

const Loader3 = ({ active }) => {
    return (
        ((active === true) && (
            <div className="loader3">
                <span className="loader"></span>
            </div>
        ))
    )
}

export default Loader3
