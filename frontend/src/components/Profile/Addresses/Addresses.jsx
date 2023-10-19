import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from "react-redux";

import "./Addresses.css";
import {
    cityValidator,
    flatValidator,
    mobileNumValidator,
    nameValidator,
    stateValidator,
    streetValidator,
    zipValidator
} from './AddressValidators.js';
import { toast } from 'react-toastify';
import { USER_ADDRESS_ADD_RESET, USER_ADDRESS_UPDATE_RESET } from '../../../State/constants/ProfileConstants';
import AddressForm from './AddressForm';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import AddressCard from './AddressCard';
import { bindActionCreators } from 'redux';
import { profileActionCreators } from '../../../State/action-creators';


const Addresses = () => {

    const { addingAddress, addedAddress, addedAddressMessage, addAddressError } = useSelector(state => state.addAddress);
    const { updatingDeletingAddress, updatedDeletedAddress, updatedDeletedAddressMessage, updateDeleteAddressError } = useSelector(state => state.updateDeleteAddress);

    const { gettingAddresses, addresses } = useSelector(state => state.addresses);

    const dispatch = useDispatch();
    const { getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress } = bindActionCreators(profileActionCreators, dispatch);

    const [validateFields, setValidateFields] = useState(false);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [showEditAddressForm, setShowEditAddressForm] = useState(false);
    const [address, setAddress] = useState({
        first_name: "",
        last_name: "",
        flat: "",
        street_address: "",
        landmark: "",
        city: "",
        state: "",
        state_code: "",
        zip: "",
        mobile: "",
        delivery_notes: "",
        default_address: false,
    });
    const errorRef = useRef(null);


    useEffect(() => {
        toast.error((addAddressError || updateDeleteAddressError), {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [addAddressError, updateDeleteAddressError]);


    useEffect(() => {
        toast.success((addedAddressMessage || updatedDeletedAddressMessage), {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [addedAddressMessage, updatedDeletedAddressMessage]);


    useEffect(() => {
        getUserAddresses();
        // eslint-disable-next-line
    }, []);

    
    useEffect(() => {
        if (gettingAddresses || updatingDeletingAddress) {
            dispatch(loaderSpin(true));
        }
        else {
            dispatch(loaderSpin(false));
        }

        // eslint-disable-next-line
    }, [gettingAddresses, updatingDeletingAddress])


    const validateAddressFields = () => {
        const validators = [
            nameValidator(address.first_name, "First name"),
            nameValidator(address.last_name, "Last name"),
            flatValidator(address.flat),
            streetValidator(address.street_address),
            cityValidator(address.city, address.state_code),
            stateValidator(address.state),
            zipValidator(address.zip),
            mobileNumValidator(address.mobile),
        ];

        return validators.every((validator) => !validator);
    };


    const addAddressHandler = (e) => {

        e.preventDefault();
        setValidateFields(true);

        if (validateAddressFields()) {
            addUserAddress(address);
            errorRef.current.style.display = "none";
        }
        else {
            errorRef.current.style.display = "flex";
            window.scrollTo({
                top: errorRef.current.offsetTop
            });
        }
    }


    const resetAddressForm = () => {
        setAddress({
            first_name: "",
            last_name: "",
            flat: "",
            street_address: "",
            landmark: "",
            city: "",
            state: "",
            state_code: "",
            zip: "",
            mobile: "",
            delivery_notes: "",
            default_address: false,
        });
        setValidateFields(false);
        setShowAddAddressForm(false);
        setShowEditAddressForm(false);
        window.scrollTo(0, 0);
    };


    useEffect(() => {
        if (addedAddress) {
            resetAddressForm();
            dispatch({ type: USER_ADDRESS_ADD_RESET });
            getUserAddresses();
        }
        // eslint-disable-next-line
    }, [addedAddress]);


    useEffect(() => {
        if (updatedDeletedAddress) {
            resetAddressForm();
            dispatch({ type: USER_ADDRESS_UPDATE_RESET });
            getUserAddresses();
        }
        // eslint-disable-next-line
    }, [updatedDeletedAddress]);


    const editClickHandler = (id) => {

        window.scrollTo(0,0);
        
        for (let i = 0; i < addresses.length; i++) {
            const element = addresses[i];
            if (element._id === id) {
                setAddress(element);
                setShowEditAddressForm(true);
            }
        }
    }


    const editAddressHandler = (e) => {
        e.preventDefault();
        setValidateFields(true);

        if (validateAddressFields()) {
            updateUserAddress(address, address._id);
            errorRef.current.style.display = "none";
        }
        else {
            errorRef.current.style.display = "flex";
            window.scrollTo({
                top: errorRef.current.offsetTop
            });
        }
    }

    const removeClickHandler = (id) => {
        deleteUserAddress(id);
    }


    return (
        <div className="profile-page-content">

            <div className="page-head">Delivery Addresses</div>

            <div className="addresses-container">

                {!showEditAddressForm && (
                    <div
                        onClick={() => { !showAddAddressForm && setShowAddAddressForm(true) }}
                        className={`${!showAddAddressForm ? "inferior-btn" : "addresses-container-head"}`}
                    >
                        + Add Address
                    </div>
                )}

                {showAddAddressForm ? (
                    <>
                        <div ref={errorRef} className="error-alert" style={{ marginBottom: "10px", display: "none" }}>
                            Please verify all fields below.
                        </div>

                        <AddressForm
                            onSubmit={addAddressHandler}
                            address={address}
                            setAddress={setAddress}
                            disableSaveBtn={addingAddress}
                            validateFields={validateFields}
                            cancelClickHandler={resetAddressForm}
                        />
                    </>

                ) : (showEditAddressForm ? (

                    <>
                        <div className="addresses-container-head">
                            + Edit Address
                        </div>

                        <div ref={errorRef} className="error-alert" style={{ marginBottom: "10px", display: "none" }}>
                            Please verify all fields below.
                        </div>

                        <AddressForm
                            onSubmit={editAddressHandler}
                            address={address}
                            setAddress={setAddress}
                            disableSaveBtn={updatingDeletingAddress}
                            validateFields={validateFields}
                            cancelClickHandler={resetAddressForm}
                        />
                    </>

                ) : (

                    (!gettingAddresses && addresses && addresses.length > 0) && (
                        addresses.map((address, index) => {
                            return (
                                <AddressCard
                                    key={index}
                                    address={address}
                                    editClickHandler={editClickHandler}
                                    removeClickHandler={removeClickHandler}
                                />
                            )
                        })
                    )
                ))}

            </div>
        </div>
    )
}

export default Addresses
