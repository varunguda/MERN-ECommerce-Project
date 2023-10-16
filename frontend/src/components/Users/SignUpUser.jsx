import React, { useEffect, useRef, useState } from 'react';
import Metadata from '../Metadata';
import { useLocation, useNavigate } from 'react-router';
import { bindActionCreators } from 'redux';
import { userActionCreators } from '../../State/action-creators';
import { useDispatch, useSelector } from 'react-redux';
import Loader2 from '../layouts/Loader/Loader2';
import { passLengthValidator, passLetterValidator, passNumberOrSpecialCharValidator } from './validators';
import BannerPage from "../layouts/Banner/BannerPage.jsx";
import { VERIFY_USER_RESET } from '../../State/constants/UserConstants';

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
        avatar: ""
    });
    const [verifyPage, setVerifyPage] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("/images/profileplaceholder.png");
    const passTipsRef = useRef(null);
    const passRef = useRef(null);
    const errRef = useRef(null);

    const [otp, setOtp] = useState(Array(5).fill(''));
    const otpInputRefs = useRef([]);


    useEffect(() => {
        otpInputRefs.current = otpInputRefs.current.slice(0, otp.length);
    }, [otp]);


    const handleChange = (e, index) => {

        if (errRef.current) {
            errRef.current.innerHTML = "";
        }

        const value = e.target.value;

        if (!isNaN(value)) {

            setOtp([...otp.map((d, indx) => (indx === index ? value.slice(0, 1) : d.slice(0, 1)))]);

            if (value === '' && index > 0) {
                setTimeout(() => {
                    otpInputRefs.current[index - 1].focus();
                }, 0)
            } else if (index < otp.length - 1) {
                setTimeout(() => {
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
            if (sessionStorage.getItem("mail")) {
                sessionStorage.removeItem("mail")
            }

            setTimeout(() => {
                navigate("/");

                dispatch({
                    type: VERIFY_USER_RESET,
                })
            }, 3000);
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

    const verifyOtpHandler = (e) => {
        e.preventDefault();

        if (otp.join('').length === 5) {
            verifyUser(otp.join(''));
        }
    }


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


    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setUser({ ...user, avatar: reader.result });
                }
            };

            const file = e.target.files[0];

            if (file) {
                reader.readAsDataURL(file);
            } else {
                setAvatarPreview("/images/profileplaceholder.png");
                setUser({ ...user, avatar: "" });
            }
        }
    };



    return (
        <div className='center-container'>

            <Metadata title={"Sign Up - Create a ManyIN account"} />

            {!verifyPage ? (

                !sentSignupCode ? (

                    <div className='secondary-page-content'>

                        <img className='logo-image logo-image-extra-small' src="/ManyIN_LOGO.png" alt="logo" />

                        <div className='secondary-head'>Create your ManyIN account</div>

                        <form onSubmit={createAccountHandler} method="post" >

                            <div id="registerImage">

                                <label htmlFor="avatar" className="custom-file-upload">
                                    <span><img src={avatarPreview} alt="Avatar Preview" /></span>

                                    <input
                                        type="file"
                                        id="avatar"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={registerDataChange}
                                    />
                                </label>

                                <div className='small-head'>Add a profile picture</div>
                            </div>

                            <div className="mail-details">
                                <div className='small-head'>Email Address*</div>
                                <div>
                                    <span>{user.mail}</span>
                                    <button className='inferior-btn' onClick={changeMailClickHandler} type='button'>Change</button>
                                </div>
                            </div>

                            <div className="input-section">
                                <label className='label1' htmlFor="name">Name*</label>
                                <input
                                    className={`input1 ${((user.name.length < 3) && (user.name.length !== 0)) ? "invalid" : ""}`}
                                    onChange={inputChangeHandler}
                                    type="text"
                                    name="name"
                                    id="name"
                                />
                            </div>

                            <div className="input-section">
                                <label className='label1' htmlFor="pass">Create a new password*</label>
                                <input
                                    ref={passRef}
                                    className={`input1 pass-input ${(!passLengthValidator(user.pass) || !passLetterValidator(user.pass) || !passNumberOrSpecialCharValidator(user.pass)) ? "invalid" : ""}`}
                                    onChange={inputChangeHandler}
                                    type="password"
                                    name="pass"
                                    id="pass"
                                    onCopy={(e) => e.preventDefault()}
                                    onFocus={passFocusHandler}
                                />
                                <span className='inferior-btn show-pass-btn' onClick={showPassClickHandler}>{showPass ? "hide" : "show"}</span>
                            </div>


                            <div className="input-section">
                                <label className='label1' htmlFor="confirm-pass">Confirm password*</label>
                                <input
                                    className={`input1 pass-input ${((user.confirmPass.length !== 0) && user.confirmPass !== user.pass) ? "invalid" : ""}`}
                                    onChange={inputChangeHandler}
                                    type="password"
                                    name="confirmPass"
                                    id="confirmPass"
                                    onCopy={(e) => e.preventDefault()}
                                />
                            </div>


                            <ul ref={passTipsRef} className="password-tips">
                                <div className="small-head">Your password must include the following:</div>

                                <li className={`${(user.pass.length !== 0) ? (passLengthValidator(user.pass) ? "valid" : "invalid") : ""}`} >8-100 characters</li>

                                <li className={`${(user.pass.length !== 0) ? (passLetterValidator(user.pass) ? "valid" : "invalid") : ""}`}>Upper & lowercase letters</li>

                                <li className={`${(user.pass.length !== 0) ? (passNumberOrSpecialCharValidator(user.pass) ? "valid" : "invalid") : ""}`}>At least one number or special character</li>
                            </ul>


                            <div className="err-msg">{signupError}</div>

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

                (!verifiedUser) ? (
                    <div>

                        <div className="verify-code-container">
                            <img className='logo-image' src="/ManyIN_LOGO.png" alt="logo" />
                            <div className='verify-head'>Enter Your 5 Digit OTP</div>

                            <form onSubmit={verifyOtpHandler}>
                                <div className="input_field_box">
                                    {otp.map((data, index) => (
                                        <input
                                            type="number"
                                            key={index}
                                            value={data}
                                            ref={ref => (otpInputRefs.current[index] = ref)}
                                            onChange={e => handleChange(e, index)}
                                            onKeyDown={e => handleKeyDown(e, index)}
                                            disabled={(index > 0 && otp[index - 1] === "") || (index < otp.length - 1 && otp[index + 1] !== "")}
                                        />
                                    ))}
                                </div>

                                <button type='submit' className='main-btn' disabled={verificationLoading || otp.join('').length !== 5}>{verificationLoading ? <Loader2 /> : "Verify OTP"}</button>

                                <div ref={errRef} className='err-msg'>{verifcationError}</div>
                            </form>
                        </div>


                    </div>
                ) : (
                    <BannerPage
                        type="done"
                        onClick={() => { navigate("/") }}
                        caption={
                            <>
                                <p>{verifcationMessage}</p>

                                <button onClick={() => navigate("/")} type="button" className='inferior-btn' style={{ color: "#0071dc" }}>Home</button>
                            </>
                        }
                    />
                )

            )}
        </div>
    )
}

export default SignUpUser
