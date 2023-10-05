import React, { useEffect, useRef, useState } from 'react';
import Metadata from '../Metadata';
import { useLocation, useNavigate } from 'react-router';
import { bindActionCreators } from 'redux';
import { userActionCreators } from '../../State/action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader2 from '../layouts/Loader/Loader2';
import { passLengthValidator, passLetterValidator, passNumberOrSpecialCharValidator } from './validators';
import BannerPage from "../layouts/Banner/BannerPage.jsx";

import "./SignUpUser.css";


const SignUpUser = () => {

    const { signupLoading, sentSignupCode, signupMessage, signupError } = useSelector(state => state.signup);
    const { verificationLoading, verifiedUser, verifcationMessage, verifcationError } = useSelector(state => state.verifySignup);

    const dispatch = useDispatch();
    const { signupUser, verifyUser } = bindActionCreators(userActionCreators, dispatch);

    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState({
        mail: sessionStorage.getItem("mail") ? sessionStorage.getItem("mail") : "",
        name: "",
        pass: "",
        confirmPass: "",
    });
    const [verifyPage, setVerifyPage] = useState(false);
    const passTipsRef = useRef(null);
    const [showPass, setShowPass] = useState(false);
    const passRef = useRef(null);


    const [otp, setOtp] = useState(Array(5).fill(''));
    const otpInputRefs = useRef([]);

    useEffect(() => {
        otpInputRefs.current = otpInputRefs.current.slice(0, otp.length);
    }, [otp]);

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (!isNaN(value)) {
            setOtp([...otp.map((d, indx) => (indx === index ? value : d))]);

            if (value === '' && index > 0) {
                setTimeout(()=>{
                    otpInputRefs.current[index - 1].focus();
                }, 0)
            } else if (index < otp.length - 1) {
                setTimeout(()=>{
                    otpInputRefs.current[index + 1].focus();
                }, 0)
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.keyCode === 8 && !otp[index] && otpInputRefs.current[index - 1]) {
            otpInputRefs.current[index - 1].focus();
        }
    };

    useEffect(() => {

        const query = new URLSearchParams(location.search);

        if (query.get("q") === "verify") {
            setVerifyPage(true);
        }

    }, [location.search])


    useEffect(() => {
        toast.error((signupError || verifcationError), {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [signupError, verifcationError])


    useEffect(() => {
        if (!user.mail) {
            navigate("/account/login");
        }
        // eslint-disable-next-line
    }, [user]);


    useEffect(() => {
        if (verifyPage && !sentSignupCode) {
            navigate("/account/login")
        }

        // eslint-disable-next-line
    }, [verifyPage, sentSignupCode]);


    useEffect(() => {
        if (verifiedUser) {
            navigate("/");

            if (sessionStorage.getItem("mail")) {
                sessionStorage.removeItem("mail")
            }

            toast.success(verifcationMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

        // eslint-disable-next-line
    }, [verifiedUser, verifcationMessage])


    const createAccountHandler = (e) => {
        e.preventDefault();

        if (user.mail && user.name && user.confirmPass) {
            signupUser(user);
        }
    }

    const changeMailClickHandler = () => {
        navigate("/account/login");
    }

    const passFocusHandler = (e) => {
        if (passTipsRef.current) {
            passTipsRef.current.style.display = "block";
        }
    }

    const inputChangeHandler = (e) => {
        setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    // const verifyCodeHandler = () => {
    //     if (code.length === 5) {
    //         verifyUser(code);
    //     }
    // }

    const showPassClickHandler = () => {
        if (passRef && passRef.current && passRef.current.type === "text") {
            setShowPass(false);
            passRef.current.type = "password";
        }
        else {
            setShowPass(true);
            passRef.current.type = "text";
        }
    }


    return (
        <div className='center-container'>

            <Metadata title={"Sign Up - Create a ManyIN account"} />

            {!verifyPage ? (

                !sentSignupCode ? (

                    <div className='secondary-page-content'>

                        <img className='logo-image-small' src="/ManyIN_LOGO.png" alt="logo" />

                        <form onSubmit={createAccountHandler} method="post" >

                            <div className="mail-details">
                                <div className='small-head'>Email Address</div>
                                <div>
                                    <span>{user.mail}</span>
                                    <button className='inferior-btn' onClick={changeMailClickHandler} type='button'>Change</button>
                                </div>
                            </div>

                            <label htmlFor="name">Name</label>
                            <input
                                className={`${((user.name.length < 3) && (user.name.length !== 0)) ? "invalid" : ""}`}
                                onChange={inputChangeHandler}
                                type="text"
                                name="name"
                                id="name"
                            />

                            <label htmlFor="pass">Create a new password</label>
                            <input
                                ref={passRef}
                                className={`pass-input ${(!passLengthValidator(user.pass) || !passLetterValidator(user.pass) || !passNumberOrSpecialCharValidator(user.pass)) ? "invalid" : ""}`}
                                onChange={inputChangeHandler}
                                type="password"
                                name="pass"
                                id="pass"
                                onCopy={(e) => e.preventDefault()}
                                onFocus={passFocusHandler}
                            />
                            <span style={{ top: "174px" }} className='inferior-btn show-pass-btn' onClick={showPassClickHandler}>{showPass ? "hide" : "show"}</span>


                            <label htmlFor="confirm-pass">Confirm password</label>
                            <input
                                className={`pass-input ${((user.confirmPass.length !== 0) && user.confirmPass !== user.pass) ? "invalid" : ""}`}
                                onChange={inputChangeHandler}
                                type="password"
                                name="confirmPass"
                                id="confirmPass"
                                onCopy={(e) => e.preventDefault()}
                            />


                            <ul ref={passTipsRef} className="password-tips">
                                <div className="small-head">Your password must include the following:</div>

                                <li className={`${(user.pass.length !== 0) ? (passLengthValidator(user.pass) ? "valid" : "invalid") : ""}`} >8-100 characters</li>

                                <li className={`${(user.pass.length !== 0) ? (passLetterValidator(user.pass) ? "valid" : "invalid") : ""}`}>Upper & lowercase letters</li>

                                <li className={`${(user.pass.length !== 0) ? (passNumberOrSpecialCharValidator(user.pass) ? "valid" : "invalid") : ""}`}>At least one number or special character</li>
                            </ul>


                            <div className="err-msg"></div>

                            <button
                                className='main-btn'
                                type="submit"
                                disabled={(signupLoading) || (user.pass !== user.confirmPass) || !passLengthValidator(user.pass) || !passLetterValidator(user.pass) || !passNumberOrSpecialCharValidator(user.pass) || (user.pass.length === 0) || (user.name.length < 3)}
                            >
                                {signupLoading ? (<Loader2 />) : "Create Account"}
                            </button>

                            <div className="form-caption">By clicking Create Account, you acknowledge you have read and agreed to our Terms of Use and Privacy Policy.</div>

                        </form>

                    </div>

                ) : (

                    <BannerPage
                        type="mail"
                        letterContent={"**code**"}
                        onClick={() => { window.open("https://mail.google.com/", '_blank'); }}
                        caption={
                            <>
                                <p>{signupMessage}</p>

                                <button onClick={() => navigate("?q=verify")} type="button" className='main-btn' style={{ fontSize: "1rem" }}>Enter Code</button>
                            </>
                        }
                    />

                )

            ) : (

                <div>

                    {/* <label htmlFor="code">Enter code</label>
                    <input onChange={(e) => setCode(e.target.value)} type="text" name="code" id="code" />
                    
                    <div className="verification-msg">{verifcationMessage}</div>
                    
                    <button className='main-btn' onClick={verifyCodeHandler} type="button" disabled={(code.length !== 5) || verificationLoading}>Verify Code</button> */}


                    <div className="verify-code-container">
                        <img className='logo-image-small' src="/ManyIN_LOGO.png" alt="logo" />
                        <div className='verify-head'>Enter Your 5 Digit OTP</div>

                        <form>
                            <div className="input_field_box">
                                {otp.map((data, index) => (
                                    <input
                                        type="number"
                                        key={index}
                                        value={data}
                                        ref={ref => (otpInputRefs.current[index] = ref)}
                                        onChange={e => handleChange(e, index)}
                                        onKeyDown={e => handleKeyDown(e, index)}
                                        maxLength="1"
                                        disabled={( index > 0 && otp[index - 1] === "" ) || ( index < otp.length - 1 && otp[index] !== "" )}
                                    />
                                ))}
                            </div>

                            <button type='submit' className='main-btn'>Verify OTP</button>
                        </form>
                    </div>


                </div>

            )}
        </div>
    )
}

export default SignUpUser
