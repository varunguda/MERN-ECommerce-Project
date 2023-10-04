import React, { useEffect, useRef, useState } from 'react';
import Metadata from '../Metadata';
import { bindActionCreators } from 'redux';
import { userActionCreators } from '../../State/action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";

import "./LoginUser.css";

const LoginUser = () => {

    const { checkingUser, userExist, userEmail, userCheckError } = useSelector(state => state.checkUser);

    const { loginLoading, loggedIn, loginMessage, loginError } = useSelector(state => state.login);

    const dispatch = useDispatch();
    const { checkUsersAccount, loginUser } = bindActionCreators(userActionCreators, dispatch);

    const navigate = useNavigate();

    const [mail, setMail] = useState(sessionStorage.getItem("mail") ? sessionStorage.getItem("mail") : "");
    const [pass, setPass] = useState("");
    const [fetched, setFetched] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const passRef = useRef(null);
    const passErrMsgRef = useRef(null);


    useEffect(() => {
        toast.error((userCheckError || loginError), {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [userCheckError, loginError])


    useEffect(() => {
        if (!checkingUser && !userExist && fetched) {
            sessionStorage.setItem("mail", userEmail);
            navigate("/account/signup");
        }
        // eslint-disable-next-line
    }, [checkingUser, userExist, fetched]);


    useEffect(() => {
        if (loggedIn) {
            navigate("/");

            if (sessionStorage.getItem("mail")) {
                sessionStorage.removeItem("mail")
            }
        }
        // eslint-disable-next-line
    }, [loggedIn])


    const mailChangeHandler = (e) => {
        setMail(e.target.value);
    }

    const passChangeHandler = (e) => {
        if(passErrMsgRef.current && passErrMsgRef.current.innerHTML !== ""){
            passErrMsgRef.current.innerHTML = "";
        }
        setPass(e.target.value);
    }

    const mailSubmitHandler = (e) => {
        e.preventDefault();

        if (mail) {
            sessionStorage.setItem("mail", mail);
            checkUsersAccount(mail);
            setFetched(true);
        }
    }

    const passSubmitHandler = (e) => {
        e.preventDefault();

        if (userEmail && pass) {
            loginUser(userEmail, pass);
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


    return (
        <div className='login-container'>
            
            <Metadata title={"Login"} />

            <div className="login-page-content">


                <img src="/ManyIN_LOGO.png" alt="logo" />

                {(!fetched) && (

                    <>

                        <div className='login-head'>Sign in or create your account</div>
                        <span>Not sure if you have an account?</span>
                        <span>Enter your email and we'll check for you.</span>

                        <form onSubmit={mailSubmitHandler} method="post">

                            <label htmlFor="email">Email Address</label>
                            <input onChange={mailChangeHandler} value={mail} type="email" name="email" id="email" spellCheck={false} />

                            <button className='main-btn' type="submit" disabled={checkingUser}>Continue</button>

                            <div className="form-caption">Securing your personal information is our priority.</div>
                        </form>
                    </>


                )}


                {(userExist && fetched) && (
                    <>

                        <div className='login-head'>Login to your account</div>
                        <span>You are a ManyIN user.</span>
                        <span>Please enter your password in the given field below.</span>

                        <form className='pass-form' onSubmit={passSubmitHandler} method="post">

                            <label htmlFor="pass">Password</label>
                            <input ref={passRef} onChange={passChangeHandler} type="password" name="pass" value={pass} id="pass" spellCheck={false} />
                            <span className='inferior-btn show-pass-btn' onClick={showPassClickHandler}>{showPass ? "hide" : "show"}</span>


                            <div ref={passErrMsgRef} className='err-msg'>{loginMessage ? loginMessage : ""}</div>

                            <button className='main-btn' type="submit" disabled={loginLoading}>Log In</button>

                            <button className='inferior-btn forgot-pass-btn' type="button">Forgot Password?</button>

                        </form>
                    </>

                )}

            </div>

        </div>
    )
}

export default LoginUser
