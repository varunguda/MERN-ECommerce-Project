import React from 'react'
import { RxCross2 } from 'react-icons/rx'

const CrossButton = ({ onClick, content }) => {
    return (
        <div
            onClick={onClick}
            className='filter-btn'
        >
            <span>{content}</span>
            <RxCross2 />
        </div>
    )
}

export default CrossButton
