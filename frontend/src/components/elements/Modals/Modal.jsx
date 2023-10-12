import React, { useEffect, useRef } from 'react';
import "./Modal.css";
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modalActionCreators } from '../../../State/action-creators';
import { AiOutlineClose } from "react-icons/ai"


const Modal = (props) => {

    const modalRef = useRef(null);
    const modalContainerRef = useRef(null)

    const dispatch = useDispatch();

    const { closeModal } = bindActionCreators(modalActionCreators, dispatch)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && !props.noOutClick) {
                if (modalContainerRef && modalContainerRef.current.classList.contains("open")) {
                    closeModal();
                }
            }
        }

        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line
    }, [props.noOutClick]);

    return (
        <div ref={modalContainerRef} className={`modal-container ${props.open ? "open" : ""}`}>

            <div className="background" />
            
            <div ref={modalRef} className="modal">
                
                    <AiOutlineClose onClick={() => { closeModal() }} className="close-modal-icon" color='#74767c' />

                    <div className="modal-heading-content">
                        <div className='heading'>{props.heading}</div>
                        <div
                            className="modal-content"
                        >{props.content}</div>
                    </div>

            </div>
        </div>
    )
}

export default Modal