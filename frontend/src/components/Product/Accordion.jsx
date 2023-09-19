import React, { useState, useRef, useEffect } from "react";
import {BsChevronDown} from "react-icons/bs";
import {BsChevronUp} from "react-icons/bs";

import "./Accordion.css";

const Accordion = (props) => {
    const [active, setActive] = useState(true);
    const content = useRef(null);
    const [height, setHeight] = useState(`0px`);

    useEffect(()=> {
        setHeight(`${content.current.scrollHeight}px`);
    }, [content])

    const toggleAccordion = () => {
        setActive(!active);
        setHeight(active ? `0px` : `${content.current.scrollHeight}px`);
    }

    return (
        <div className="accordion__section">
            <div
                className={`accordion ${active ? "active" : ""}`}
            >
                <p className="accordion__title">{props.title}</p>
                <span className="accordion-toggle-icon" onClick={toggleAccordion} style={{ marginLeft: "20px" }}>{active ? <BsChevronUp /> : <BsChevronDown />}</span>
            </div>
            <div
                ref={content}
                style={{ maxHeight: `${height}` }}
                className="accordion__content"
            >
                <div
                    className="accordion__text"
                    dangerouslySetInnerHTML={{ __html: props.content }}
                />
            </div>
        </div>
    );
}

export default Accordion;
