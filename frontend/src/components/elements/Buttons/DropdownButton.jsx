import React, { useEffect, useRef, useState } from 'react';
import { BsChevronDown } from "react-icons/bs";
import { TbDotsVertical } from "react-icons/tb";

import "./DropdownButton.css";

const DropdownButton = ({ name, contentArr, icon, clickedElem }) => {

    const [rotate, setRotate] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const buttonRef = useRef(null);

    const handleButtonClick = () => {
        setRotate(prev => (prev === 0) ? 180 : 0)
    }

    const handleCheckClick = (e) => {
        setIsChecked(prev => !prev);
    }

    useEffect(() => {
        const closeDropDown = (e) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target) && isChecked) {
                setIsChecked(false);
            }
        }

        window.addEventListener("mousedown", closeDropDown);

        return () => {
            window.removeEventListener("mousedown", closeDropDown);
        }
    }, [isChecked])

    return (
        <div ref={buttonRef} className='dropdown-button-container'>
            <label className="dropdown">
                {!icon ? (
                    <div onClick={handleButtonClick} className="dd-button">
                        {name}
                        <span style={{ transform: `rotate(${rotate}deg)` }}>
                            <BsChevronDown size={11} />
                        </span>
                    </div>
                ) : (
                    <div onClick={handleButtonClick} className="dd-icon-button">
                        <TbDotsVertical />
                    </div>
                )}

                <input onChange={handleCheckClick} type="checkbox" checked={isChecked} className="dd-input" id="test" />
                <ul onClick={(e) => clickedElem(e.target.innerHTML)} className="dd-menu">
                    {contentArr && contentArr.map((elem, index) => {
                        return <li key={index}>{elem}</li>
                    })}
                </ul>
            </label>
        </div>
    )
}

export default DropdownButton
