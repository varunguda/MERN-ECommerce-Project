
import { BsStar } from "react-icons/bs";
import { BsStarFill } from "react-icons/bs";
import { BsStarHalf } from "react-icons/bs";

import React from 'react';
import "./Stars.css";

const Stars = ({ value, size }) => {

    const ratingStars = [...Array(5)].map((elem, index) => {

        const num = index + 0.5;

        return (
            <span key={index}>
                {
                    value >= index + 1 ? <BsStarFill className="star-icon" size={size} /> : value >= num ? <BsStarHalf className="star-icon" size={size} /> : <BsStar className="star-icon" size={size} />
                }
            </span>
        )
    });

    return (
        <span className="star-container">{ratingStars}</span>
    )
}

export default Stars
