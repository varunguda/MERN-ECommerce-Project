import React, { useEffect } from 'react'
import {
    Route,
    Routes,
    useLocation
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Modal from './components/elements/Modals/Modal.jsx';
import { useSelector } from 'react-redux';
import Home from './components/Home/Home.jsx'
import ProductPage from './components/Product/ProductPage.jsx'
import ProductsPage from './components/Product/ProductsPage.jsx'
import Footer from './components/layouts/Footer/Footer.jsx';
import Navbar from './components/layouts/Navbar/Navbar.jsx';

const ContentRoutes = () => {

    const location = useLocation();

    const { open, content, heading, noOutClick } = useSelector((state) => state.modal);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    }, [open]);

    return (
        <>

            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <Modal open={open} content={content} heading={heading} noOutClick={noOutClick} />


            {!location.pathname.includes("/account") && (
                <>
                    <Navbar />
                    <div className='content-container'>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                            <Route path="/search" element={<ProductsPage />} />
                        </Routes>
                    </div>
                    <Footer />
                </>
            )}
        </>
    )
}

export default ContentRoutes;
