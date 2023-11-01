import React, { useEffect, useRef, useState } from 'react'
import Metadata from '../Metadata'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux';
import { userActionCreators } from '../../State/action-creators';
import { useLocation, useNavigate, useParams } from 'react-router';
import { RESET_PASSWORD_RESET } from '../../State/constants/UserConstants';
import Loader2 from '../layouts/Loader/Loader2';
import BannerPage from '../layouts/Banner/BannerPage';
import { passLengthValidator, passLetterValidator, passNumberOrSpecialCharValidator } from './validators';

const ResetPassword = () => {

    const { resettingPassword, passwordChanged, resetPasswordMessage, resetPasswordError } = useSelector(state => state.resetPassword);

    const dispatch = useDispatch();
    const { resetPassword } = bindActionCreators(userActionCreators, dispatch);

    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const passRef = useRef(null);
    const passTipsRef = useRef(null);

    const { token } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        dispatch({
            type: RESET_PASSWORD_RESET,
        })

        // eslint-disable-next-line
    }, [location.pathname]);


    const passChangeHandler = (e) => {
        if (e.target.name === "pass") {
            setPass(e.target.value);
        }
        else if (e.target.name === "confirmPass") {
            setConfirmPass(e.target.value);
        }
    }

    const passwordSubmitHandler = (e) => {
        e.preventDefault();

        if ((pass === confirmPass) && (pass.length >= 8) && (confirmPass.length >= 8)) {
            resetPassword(pass, confirmPass, token);
        }
    }

    const passFocusHandler = (e) => {
        if (passTipsRef.current) {
            passTipsRef.current.style.display = "block";
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
        <>
            <Metadata title={"Reset Password - ManyIN"} />

            {!passwordChanged ? (

                <div className='center-container'>

                    <div className="secondary-page-content">

                        <img className='logo-image' src="/ManyIN_LOGO.png" alt="logo" />

                        <div className="secondary-head">Change Password</div>

                        <form onSubmit={passwordSubmitHandler} method="post">

                            <div className="input-section">
                                <label className='label1' htmlFor="pass">New password *</label>
                                <input
                                    ref={passRef}
                                    className={`input1 pass-input ${(!passLengthValidator(pass) || !passLetterValidator(pass) || !passNumberOrSpecialCharValidator(pass)) ? "invalid" : ""}`}
                                    onChange={passChangeHandler}
                                    value={pass}
                                    type="password"
                                    name="pass"
                                    id="pass"
                                    spellCheck={false}
                                    onCopy={(e) => e.preventDefault()}
                                    onFocus={passFocusHandler}
                                />

                                <span className='inferior-btn show-pass-btn' onClick={showPassClickHandler}>{showPass ? "hide" : "show"}</span>
                            </div>
                            

                            <div className="input-section">
                                <label className='label1' htmlFor="confirmPass">Confirm New password *</label>
                                <input
                                    className={`input1 pass-input ${((confirmPass.length !== 0) && confirmPass !== pass) ? "invalid" : ""}`}
                                    onChange={passChangeHandler}
                                    value={confirmPass}
                                    type="password"
                                    name="confirmPass"
                                    id="confirmPass"
                                    spellCheck={false}
                                    onCopy={(e) => e.preventDefault()}
                                />
                            </div>


                            <ul ref={passTipsRef} className="password-tips">
                                <div className="small-head">Your password must include the following:</div>

                                <li className={`${(pass.length !== 0) ? (passLengthValidator(pass) ? "valid" : "invalid") : ""}`} >8-100 characters</li>

                                <li className={`${(pass.length !== 0) ? (passLetterValidator(pass) ? "valid" : "invalid") : ""}`}>Upper & lowercase letters</li>

                                <li className={`${(pass.length !== 0) ? (passNumberOrSpecialCharValidator(pass) ? "valid" : "invalid") : ""}`}>At least one number or special character</li>
                            </ul>


                            <p className='err-msg'>{resetPasswordError}</p>


                            <button
                                className='main-btn loader-btn'
                                type="submit"
                                disabled={resettingPassword || (pass.length < 8) || (pass !== confirmPass) || !passLengthValidator(pass) || !passLetterValidator(pass) || !passNumberOrSpecialCharValidator(pass) || (pass.length === 0)}
                            >
                                {resettingPassword ? (<Loader2 />) : "Reset password"}
                            </button>

                        </form>

                    </div>

                </div>
            ) : (

                <BannerPage
                    type="done"
                    onClick={() => { navigate("/account/login") }}
                    caption={
                        <>
                            <p>
                                {resetPasswordMessage}
                            </p>

                            <button onClick={() => navigate("/account/login")} type="button" className='inferior-btn' style={{ color: "#0071dc" }}>Login</button>
                        </>
                    }
                />
            )}
        </>
    )
}


export default ResetPassword;
