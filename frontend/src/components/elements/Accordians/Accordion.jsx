import React, { useState, useRef, useEffect } from "react";
import "./Accordion.css";
import IconChevronUp from '@tabler/icons-react/dist/esm/icons/IconChevronUp';
import IconChevronDown from '@tabler/icons-react/dist/esm/icons/IconChevronDown';


const Accordion = ({ title, content, resize, style, noBorder, activeProp, setActiveProp, close, titleClassName }) => {
    const [active, setActive] = useState(close ? false : true);
    const [height, setHeight] = useState(`0px`);
    const contentRef = useRef(null);

    useEffect(() => {
        if (activeProp !== undefined) {
            setActive(activeProp);
        }
    }, [activeProp]);
    

    useEffect(() => {
        if (((content && contentRef.current) || resize === true ) && activeProp !== undefined ? activeProp === true : active === true) {
            setHeight(`${contentRef.current.scrollHeight}px`);
        }
    }, [content, resize, activeProp, active]);


    useEffect(() => {
        if (active) {
            setHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setHeight(`0px`);
        }
    }, [active]);


    const toggleAccordion = () => {
        if (activeProp !== undefined && setActiveProp !== undefined) {
            setActiveProp(!active);
        } else {
            setActive(!active);
        }
    };

    return (
        <div className={`accordion__section ${titleClassName}`} style={noBorder && { borderTop: "none" }}>
            <div className={`accordion ${active ? "active" : ""}`}>
                <div className="accordion__title" style={{ ...style }}>
                    {title}
                </div>
                <span className="accordion-toggle-icon" onClick={toggleAccordion} style={{ marginLeft: "20px" }}>
                    {active ? <IconChevronUp size={20} strokeWidth={1.25} /> : <IconChevronDown size={20} strokeWidth={1.25} />}
                </span>
            </div>
            <div ref={contentRef} style={{ maxHeight: `${height}` }} className="accordion__content">
                <div className="accordion__text">{content}</div>
            </div>
        </div>
    );
};

export default Accordion;



// const Accordion = ({ title, content, resize, style, noBorder, close }) => {

//     const [active, setActive] = useState(true);
//     const [height, setHeight] = useState(`0px`);
//     const contentRef = useRef(null);

//     useEffect(() => {
//         if((content && contentRef.current && active) || resize === true){
//             setHeight(`${contentRef.current.scrollHeight}px`);
//         }
//     }, [content, active, resize]);


//     useEffect(() => {
//         if(close === true){
//             setHeight(`${contentRef.current.scrollHeight}px`);
//         }else if(close === false){
//             setHeight(`0px`);
//         }
//     }, [close]);


//     const toggleAccordion = () => {
//         setActive(!active);
//         setHeight(active ? `0px` : `${contentRef.current.scrollHeight}px`);
//     };


//     return (
//         <div className="accordion__section" style={noBorder && { borderTop: "none" }}>
//             <div
//                 className={`accordion ${active ? "active" : ""}`}
//             >
//                 <div className="accordion__title" style={{...style}}>{title}</div>
//                 <span className="accordion-toggle-icon" onClick={toggleAccordion} style={{ marginLeft: "20px" }}>{active ? <BsChevronUp /> : <BsChevronDown />}</span>
//             </div>
//             <div
//                 ref={contentRef}
//                 style={{ maxHeight: `${height}` }}
//                 className="accordion__content"
//             >
//                 <div
//                     className="accordion__text"
//                 >
//                     {content}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Accordion;
