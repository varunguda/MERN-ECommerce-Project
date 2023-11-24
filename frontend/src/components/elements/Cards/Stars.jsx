import React, { useEffect, useState } from 'react';
import IconStar from '@tabler/icons-react/dist/esm/icons/IconStar';
import IconStarFilled from '@tabler/icons-react/dist/esm/icons/IconStarFilled';
import IconStarHalfFilled from '@tabler/icons-react/dist/esm/icons/IconStarHalfFilled';
import "./Stars.css";


const Stars = ({ value, size, readOnly, getVal }) => {

    const [ starValue, setStarValue ] = useState(value);

    const starClickHandler = (ind) => {
        if(readOnly === false){
            getVal(ind + 1);
            setStarValue(ind + 1);
        }
    }

    useEffect(() => {
        if(value !== starValue){
            setStarValue(value);
        }
        // eslint-disable-next-line
    }, [value]);
    

    const ratingStars = [...Array(5)].map((elem, index) => {

        const num = index + 0.5;

        return (
            (readOnly !== false) ? (
                <span key={index}>
                    {
                        value >= index + 1 ?
                            <IconStarFilled strokeWidth={1.25} className="star-icon" size={size} />
                        : value >= num ? 
                            <IconStarHalfFilled strokeWidth={1.25} className="star-icon" size={size} />
                        :
                            <IconStar strokeWidth={1.25} className="star-icon" size={size} />
                    }
                </span>
            ) : (
                <span key={index} onClick={() => starClickHandler(index)}>
                    {
                        starValue >= index + 1 ?
                            <IconStarFilled strokeWidth={1.25} className="star-icon light" size={size} />
                        :
                            <IconStar strokeWidth={1.25} className="star-icon light" size={size} />
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
