import React, { useEffect, useState } from 'react';
import Metadata from '../Metadata';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { userActionCreators } from '../../State/action-creators';
import { toast } from 'react-toastify';
import BannerPage from "../layouts/Banner/BannerPage.jsx";
import Loader2 from "../layouts/Loader/Loader2.jsx";
import { useLocation, useNavigate } from 'react-router';
import { FORGOT_PASSWORD_RESET } from '../../State/constants/UserConstants';


const ForgotPassword = () => {

    const { sendingRecoveryMail, sentRecoveryMail, recoveryMailError } = useSelector(state => state.forgotPassword);

    const dispatch = useDispatch();
    const { sendPassRecoveryMail } = bindActionCreators(userActionCreators, dispatch);

    const [mail, setMail] = useState(sessionStorage.getItem("mail") ? sessionStorage.getItem("mail") : "");


    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        toast.error(recoveryMailError, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [recoveryMailError]);


    useEffect(() => {
        dispatch({
            type: FORGOT_PASSWORD_RESET,
        })

        // eslint-disable-next-line
    }, [location.pathname])

    const mailChangeHandler = (e) => {
        setMail(e.target.value);
    }

    const mailSubmitHandler = (e) => {
        e.preventDefault();

        if (mail) {
            sendPassRecoveryMail(mail);
        }
    }

    return (
        <>

            <Metadata title={"Forgot Password - ManyIN"} />

            {!sentRecoveryMail ? (

                <div className='center-container'>

                    <div className="secondary-page-content">
                        <img className='logo-image' src="/ManyIN_LOGO.png" alt="logo" />

                        <div className="secondary-head">Reset Password</div>

                        <p>Enter your email and we'll send a link <br />
                            to reset your password.</p>

                        <form onSubmit={mailSubmitHandler} method="post">

                            <div className="input-section">
                                <label className='label1' htmlFor="email">Email Address *</label>
                                <input
                                    className='input1'
                                    onChange={mailChangeHandler}
                                    value={mail}
                                    type="email"
                                    name="email"
                                    id="email"
                                    spellCheck={false}
                                />
                            </div>

                            <button 
                                className='main-btn loader-btn' 
                                type="submit" 
                                disabled={sendingRecoveryMail}
                            >
                                {sendingRecoveryMail ? (<Loader2 />) : "Send Link"}
                            </button>

                            <p className="form-caption">The email must be linked to your ManyIN account.</p>
                        </form>

                    </div>
                </div>
            ) : (

                <BannerPage
                    type="mail"
                    letterContent={"Reset password"}
                    onClick={() => { window.open("https://mail.google.com/", '_blank'); }}
                    caption={
                        <>
                            <p>
                                A password recovery link has been sent to{" "}
                                <span style={{ textDecoration: "1px underline" }}>{mail}</span> successfully.
                            </p>

                            <button onClick={() => navigate("/account/login")} type="button" className='inferior-btn' style={{ color: "#0071dc" }}>Login</button>
                        </>
                    }
                />
            )}

        </>

    )
}

export default ForgotPassword
