import React, { createContext, useEffect, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {

    const [modalHeading, setModalHeading] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noOutClick, setNoOutClick] = useState(false);

    const openModal = (heading, content, noOutClick = false) => {
        setModalHeading(heading);
        setModalContent(content);
        setIsModalOpen(true);
        setNoOutClick(noOutClick);
    };

    const closeModal = () => {
        setModalHeading(null);
        setModalContent(null);
        setIsModalOpen(false);
        setNoOutClick(false);
    };


    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    }, [isModalOpen])

    return (
        <ModalContext.Provider value={{ modalHeading, modalContent, isModalOpen, noOutClick, openModal, closeModal, setModalContent, setModalHeading }}>
            {children}
        </ModalContext.Provider>
    );
};
