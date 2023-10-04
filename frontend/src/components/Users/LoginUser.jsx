import React, { useEffect, useState } from 'react';
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


    useEffect(()=> {
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


    useEffect(()=>{
        if(!checkingUser && !userExist && fetched){
            sessionStorage.setItem("mail", userEmail);
            navigate("/account/signup");
        }
        // eslint-disable-next-line
    }, [checkingUser, userExist, fetched]);


    useEffect(()=>{
        if(loggedIn){
            navigate("/");
            
            if(sessionStorage.getItem("mail")){
                sessionStorage.removeItem("mail")
            }
        }
        // eslint-disable-next-line
    }, [loggedIn])


    const mailChangeHandler = (e) => {
        setMail(e.target.value);
    }

    const passChangeHandler = (e) => {
        setPass(e.target.value);
    }

    const mailSubmitHandler = (e) => {
        e.preventDefault();

        if (mail) {
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

    return (
        <>
            <Metadata title={"Login"} />

            {(!fetched) && (
                <form onSubmit={mailSubmitHandler} method="post">
                    <label htmlFor="email">Email Address</label>
                    <input onChange={mailChangeHandler} value={mail} type="email" name="email" id="email" />

                    <button type="submit" disabled={checkingUser}>Continue</button>
                </form>
            )}


            {(userExist && fetched) && (

                <form onSubmit={passSubmitHandler} method="post">
                    <label htmlFor="pass">Password</label>
                    <input onChange={passChangeHandler} type="password" name="pass" value={pass} id="pass" />

                    <div className='err-message'>{loginMessage ? loginMessage : ""}</div>
                    <button type="submit" disabled={loginLoading}>Log In</button>
                </form>

            )}
        </>
    )
}

export default LoginUser
