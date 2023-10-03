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

    const dispatch = useDispatch();
    const { checkUsersAccount } = bindActionCreators(userActionCreators, dispatch);

    const navigate = useNavigate();

    const [mail, setMail] = useState(userEmail ? userEmail : "");
    const [pass, setPass] = useState("");

    useEffect(()=> {
        toast.error(userCheckError, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [userCheckError])

    useEffect(()=>{
        if(!userExist && userEmail && (userEmail.length > 0)){
            console.log("navigated");
            navigate("/account/signup")
        }

        // eslint-disable-next-line
    }, [userExist, userEmail])


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
        }
    }

    const passSubmitHandler = (e) => {
        e.preventDefault();

        if (pass) {
            // checkUsersAccount(mail);
        }
    }

    return (
        <>
            <Metadata title={"Login"} />

            {(!userExist && !userEmail) && (
                <form onSubmit={mailSubmitHandler} method="post">
                    <label htmlFor="email">Email Address</label>
                    <input onChange={mailChangeHandler} value={mail} type="email" name="email" id="email" />

                    <button type="submit" disabled={checkingUser}>Continue</button>
                </form>
            )}


            {(userExist) && (

                <form onSubmit={passSubmitHandler} method="post">
                    <label htmlFor="pass">Password</label>
                    <input onChange={passChangeHandler} type="password" name="pass" value={pass} id="pass" />

                    <button type="submit">Log In</button>
                </form>

            )}
        </>
    )
}

export default LoginUser
