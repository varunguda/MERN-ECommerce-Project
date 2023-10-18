import React from 'react';
import {
    Route,
    Routes
} from "react-router-dom";
import LoginUser from './components/Users/LoginUser';
import SignUpUser from './components/Users/SignUpUser';
import ForgotPassword from './components/Users/ForgotPassword';
import ResetPassword from './components/Users/ResetPassword';
import Shipping from './components/Cart/Shipping';


const AccountRoutes = () => {
    return (
        <>
            <Routes>
                <Route path='/account/login' element={<LoginUser />} />
                <Route path='/account/signup' element={<SignUpUser />} />
                <Route path='/account/password/forgot' element={<ForgotPassword />} />
                <Route path='/account/password/reset/:token' element={<ResetPassword />} />
                <Route path='/shipping' element={<Shipping />} />
            </Routes>
        </>
    )
}

export default AccountRoutes
