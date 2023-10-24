import React, { useState } from 'react';
import { BsStar } from "react-icons/bs";
import { BsStarFill } from "react-icons/bs";
import { BsStarHalf } from "react-icons/bs";

import "./Stars.css";

const Stars = ({ value, size, readOnly, getVal }) => {

    const [ starValue, setStarValue ] = useState(value);

    const starClickHandler = (ind) => {
        if(readOnly === false){
            getVal(ind + 1);
            setStarValue(ind + 1);
        }
    }

    const ratingStars = [...Array(5)].map((elem, index) => {

        const num = index + 0.5;

        return (
            (readOnly !== false) ? (
                <span key={index}>
                    {
                        value >= index + 1 ?
                            <BsStarFill className="star-icon" size={size} />
                        : value >= num ? 
                            <BsStarHalf className="star-icon" size={size} />
                        :
                            <BsStar className="star-icon" size={size} />
                    }
                </span>
            ) : (
                <span key={index} onClick={() => starClickHandler(index)}>
                    {
                        starValue >= index + 1 ?
                            <BsStarFill className="star-icon light" size={size} />
                        :
                            <BsStar className="star-icon light" size={size} />
                    }
                </span>
            )
        )
    });

    return (
        <span className="star-container">{ratingStars}</span>
    )
}

export default Stars
