import React, { useContext } from 'react';
import "./Personal_info.css";
import { ModalContext } from '../../../Context/ModalContext';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { LOGIN_USER_RESET } from '../../../State/constants/UserConstants';


const PersonalInfo = ({ user }) => {

    const { openModal, closeModal } = useContext(ModalContext);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const deleteAccount = async () => {
        try {

            dispatch(loaderSpin(true));

            const { data } = await axios.delete("/api/v1/me/delete");

            dispatch(loaderSpin(false));

            if (data.success) {
                navigate("/");
                dispatch({ type: LOGIN_USER_RESET });
                toast.success(data.message, {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            };

        } catch (error) {

            dispatch(loaderSpin(false));
            closeModal();

            toast.error(error.response.data.message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }


    const deleteAccountClickHandler = () => {
        const modalContent = (
            <>
                <div className="modal-caption">
                    For the next 30 days, you'll retain access to log back into your account; however, please note that your account will be permanently deleted after this grace period. Please note that you may loose your data, such as saved addresses, orders placed.
                    <br />
                    <br />
                    {(user.is_seller || user.is_admin) && "You will no longer be a Seller or an Admin."}
                </div>
                <div className="modal-btn-container">
                    <button type="button" onClick={closeModal} className='secondary-btn'>No</button>
                    <button
                        type="button"
                        onClick={() => {
                            deleteAccount();
                            closeModal();
                        }}
                        className='main-btn warning'
                    >
                        Yes
                    </button>
                </div>
            </>
        )
        openModal("Are you sure you want to DELETE your account?", modalContent, true);
    }

    return (
        <div className="profile-page-content">

            <div className="page-head">Personal info</div>

            <div className="personal-info-container">
                <div className="info-head">
                    Your personal information
                </div>

                <section>
                    <span className='inferior-btn'>Edit</span>
                    <div className="section-head">Name</div>
                    <div className="section-content">{user && user.name}</div>
                </section>

                <section>
                    <span className='inferior-btn'>Edit</span>
                    <div className="section-head">Email address</div>
                    <div className="section-content">{user && user.email}</div>
                </section>

                <section>
                    <span className='inferior-btn'>{(user && user.phone_number) ? "Edit" : "Add"}</span>
                    <div className="section-head">Phone Number</div>
                    <div className="section-content">{(user && user.phone_number) ? user.phone_number : "Add phone number"}</div>
                </section>

                <section>
                    <span className='inferior-btn'>Edit</span>
                    <div className="section-head">Password</div>
                    <div className="section-content">•••••••••••••</div>
                </section>
            </div>

            <button type="button" onClick={deleteAccountClickHandler} className='main-btn warning'>Delete Account</button>
        </div>
    )
}

export default PersonalInfo
