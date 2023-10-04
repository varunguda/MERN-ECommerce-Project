import React, { useEffect, useState } from 'react';

import "./SignUpUser.css";
import Metadata from '../Metadata';
import { useLocation, useNavigate } from 'react-router';
import { bindActionCreators } from 'redux';
import { userActionCreators } from '../../State/action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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
    const [code, setCode] = useState('');


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
        if (sentSignupCode) {
            navigate("?q=verify")
        }

        // eslint-disable-next-line
    }, [sentSignupCode]);


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

    const inputChangeHandler = (e) => {
        setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const verifyCodeHandler = () => {
        if (code.length === 5) {
            verifyUser(code);
        }
    }


    return (
        <>
            <Metadata title={"Sign Up - Create a ManyIN account"} />

            {!verifyPage ? (

                <>
                    <div className="mail-details">
                        Email Address
                        <div>{user.mail}</div><button onClick={changeMailClickHandler} type='button'>Change</button>
                    </div>

                    <form onSubmit={createAccountHandler} method="post" >
                        <label htmlFor="name">Name</label>
                        <input onChange={inputChangeHandler} type="text" name="name" id="name" />

                        <label htmlFor="pass">Create a new password</label>
                        <input onChange={inputChangeHandler} type="password" name="pass" id="pass" />

                        <label htmlFor="confirm-pass">Confirm password</label>
                        <input onChange={inputChangeHandler} type="password" name="confirm-pass" id="confirm-pass" disabled={user.pass === ""} />

                        <button type="submit" disabled={signupLoading}>Create Account</button>

                    </form>

                    <div className="signup-msg">{signupMessage}</div>
                </>

            ) : (
                
                <>
                    <label htmlFor="code">Enter code</label>
                    <input onChange={(e) => setCode(e.target.value)} type="text" name="code" id="code" />

                    <div className="verification-msg">{verifcationMessage}</div>

                    <button onClick={verifyCodeHandler} type="button" disabled={(code.length !== 5) || verificationLoading}>Verify Code</button>
                </>
            )}
        </>
    )
}

export default SignUpUser
