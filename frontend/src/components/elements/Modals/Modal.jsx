import React, { useContext, useEffect, useRef } from 'react';
import "./Modal.css";
import IconX from '@tabler/icons-react/dist/esm/icons/IconX';
import { ModalContext } from '../../../Context/ModalContext';


const Modal = () => {

    const { modalHeading, modalContent, isModalOpen, closeModal, noOutClick } = useContext(ModalContext);

    const modalRef = useRef(null);
    const modalContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target) && isModalOpen && !noOutClick) {
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
    }, [isModalOpen, noOutClick]);


    if (!isModalOpen) {
        return null;
    }

    return (
        <div ref={modalContainerRef} className={`modal-container ${isModalOpen ? "open" : ""}`}>
            <div className="background" />
            <div ref={modalRef} className="modal">
                <IconX strokeWidth={1.5} size={25} onClick={() => closeModal()} className="close-modal-icon" color='#74767c' />
                <div className="modal-heading-content">
                    <div className='heading'>{modalHeading}</div>
                    <div className="modal-content">{modalContent}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
