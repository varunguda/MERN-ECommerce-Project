import React, { useEffect } from 'react'
import {
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import Home from './components/Home/Home.jsx'
import ProductPage from './components/Product/ProductPage.jsx'
import ProductsPage from './components/Product/ProductsPage.jsx'
import Footer from './components/layouts/Footer/Footer.jsx';
import Navbar from './components/layouts/Navbar/Navbar.jsx';
import Profile from './components/Profile/Profile.jsx';
import Loader3 from './components/layouts/Loader/Loader3.jsx';
import Cart from './components/Cart/Cart.jsx';
import Modal from './components/elements/Modals/Modal.jsx';
import Admin from './components/Admin/Admin.jsx';
import LoginUser from './components/Users/LoginUser';
import SignUpUser from './components/Users/SignUpUser';
import ForgotPassword from './components/Users/ForgotPassword';
import ResetPassword from './components/Users/ResetPassword';
import Shipping from './components/Cart/Shipping';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Sellers from './components/Sellers/Sellers.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';



const ContentRoutes = () => {

    const { load } = useSelector(state => state.loader);

    const location = useLocation();

    useEffect(() => {
        if (load) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    }, [load]);

    return (
        <>
            <Loader3 active={load} />

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

            <Modal />

            <>
                <Navbar />
                <div className={["/shipping", "/account"].every(elem => !location.pathname.includes(elem)) && "content-container"}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/search" element={<ProductsPage />} />
                        <Route path='/profile/:section?' element={<Profile />} />
                        <Route path='/cart' element={<Cart />} />
                        <Route path='/admin/:section?/:subcategory?' element={<Admin />} />
                        <Route path='/seller/:section?/:subcategory?' element={<Sellers />} />
                        <Route path='/account/login' element={<LoginUser />} />
                        <Route path='/account/signup' element={<SignUpUser />} />
                        <Route path='/account/password/forgot' element={<ForgotPassword />} />
                        <Route path='/account/password/reset/:token' element={<ResetPassword />} />
                        <Route path='/shipping' element={
                            <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY)}>
                                <Shipping />
                            </Elements>
                        } />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>  
                </div>
                <Footer />
            </>
        </>
    )
}

export default ContentRoutes;
