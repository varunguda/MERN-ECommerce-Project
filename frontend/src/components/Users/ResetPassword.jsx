import React, { useEffect, useState } from 'react'
import Metadata from '../Metadata'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux';
import { userActionCreators } from '../../State/action-creators';
import { useLocation, useNavigate, useParams } from 'react-router';
import { RESET_PASSWORD_RESET } from '../../State/constants/UserConstants';
import Loader2 from '../layouts/Loader/Loader2';
import BannerPage from '../layouts/Banner/BannerPage';

const ResetPassword = () => {

    const { resettingPassword, passwordChanged, resetPasswordMessage, resetPasswordError } = useSelector(state => state.resetPassword);

    const dispatch = useDispatch();
    const { resetPassword } = bindActionCreators(userActionCreators, dispatch);

    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

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


    return (
        <>
            <Metadata title={"Reset Password - ManyIN"} />

            {!passwordChanged ? (

                <div className='center-container'>

                    <div className="secondary-page-content">
                        <img className='logo-image-small' src="/ManyIN_LOGO.png" alt="logo" />

                        <div className="secondary-head">Change Password</div>

                        <form
                            onSubmit={passwordSubmitHandler}
                            method="post"
                        >

                            <label htmlFor="pass">New password *</label>
                            <input
                                onChange={passChangeHandler}
                                value={pass}
                                type="password"
                                name="pass"
                                id="pass"
                                spellCheck={false}
                                onCopy={(e) => e.preventDefault()}
                            />

                            <label htmlFor="confirmPass">Confirm New password *</label>
                            <input
                                onChange={passChangeHandler}
                                value={confirmPass}
                                type="password"
                                name="confirmPass"
                                id="confirmPass"
                                spellCheck={false}
                                onCopy={(e) => e.preventDefault()}
                            />

                            <p className='err-msg'>{resetPasswordError}</p>

                            <button
                                className='main-btn'
                                type="submit"
                                disabled={resettingPassword || (pass.length < 8) || (pass !== confirmPass)}
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
