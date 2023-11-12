import React from 'react'
import IconX from '@tabler/icons-react/dist/esm/icons/IconX';

import "./FilterButton.css";

const FilterButton = ({ onClick, content }) => {
    return (
        <div
            onClick={onClick}
            className='filter-btn'
        >
            <span>{content}</span>
            <IconX className='icon' strokeWidth={1.5} size={13}/>
        </div>
    )
}

export default FilterButton;
