import React, { useEffect, useRef, useState } from 'react';
import { BsChevronDown } from "react-icons/bs"

import "./DropdownButton.css";

const DropdownButton = ({ name, content, style}) => {

    const [rotate, setRotate] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const buttonRef = useRef(null);

    const handleButtonClick = () => {
        setRotate(prev => (prev===0) ? 180 : 0)
    }

    const handleCheckClick = (e) => {
        setIsChecked(prev => !prev);
    }

    useEffect(()=> {
        const closeDropDown = (e) => {
            if(buttonRef.current && !buttonRef.current.contains(e.target) && isChecked){
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
                <div onClick={handleButtonClick} className="dd-button">
                    {name}
                    <span style={{transform: `rotate(${rotate}deg)`}}>
                        <BsChevronDown size={11}/>
                    </span>
                </div>

                <input onChange={handleCheckClick} type="checkbox" checked={isChecked} className="dd-input" id="test" />
                <ul className="dd-menu" style={{...style}}>
                    {content}
                </ul>
            </label>
        </div>
    )
}

export default DropdownButton
