import React from 'react'
import { RxCross2 } from 'react-icons/rx';

import "./FilterButton.css";

const FilterButton = ({ onClick, content }) => {
    return (
        <div
            onClick={onClick}
            className='filter-btn'
        >
            <span>{content}</span>
            <RxCross2 className='icon' size={12}/>
        </div>
    )
}

export default FilterButton;
