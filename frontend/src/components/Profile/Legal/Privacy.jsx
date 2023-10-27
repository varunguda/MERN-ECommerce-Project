import React, { useContext } from 'react'
import { ModalContext } from '../../../Context/ModalContext'

const Privacy = () => {

    const { openModal, closeModal } = useContext(ModalContext);

    const blablaClickHandler = () => {
        const modalContent = (
        <>
        <div className="modal-btn-container">
            <button type='button' onClick={closeModal} className="secondary-btn">No</button>
            <button 
                type='button' 
                onClick={() => {
                    closeModal();
                    window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", '_blank');
                }}
                className="main-btn warning">Yes</button>
        </div>
        </>
        );
        openModal("Are you sure you want to proceed to this link?", modalContent, true);
    }

    return (
        <div>
            <button onClick={blablaClickHandler} className="inferior-btn">bla bla bla</button>
        </div>
    )
}

export default Privacy
