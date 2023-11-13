import React, { useEffect, useRef, useState } from 'react';
import IconChevronDown from '@tabler/icons-react/dist/esm/icons/IconChevronDown';
import IconDotsVertical from '@tabler/icons-react/dist/esm/icons/IconDotsVertical';


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
                            <IconChevronDown style={{ transform: `rotate(${rotate}deg)` }} size={20} strokeWidth={1.25} />
                    </div>
                ) : (
                    <div onClick={handleButtonClick} className="dd-icon-button">
                        <IconDotsVertical size={13} />
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
