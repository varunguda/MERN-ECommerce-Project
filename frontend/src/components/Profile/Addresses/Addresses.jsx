import React, { useState } from 'react';

import "./Addresses.css";
import { cityValidator, flatValidator, mobileNumValidator, stateValidator, streetValidator, zipValidator } from './AddressValidators';

const Addresses = ({ user }) => {

    const [validateFields, setValidateFields] = useState(false);
    const [showAddressBtn, setShowAddressBtn] = useState(true);
    const [address, setAddress] = useState({
        first_name: "",
        last_name: "",
        flat: "",
        street_address: "",
        landmark: "",
        city: "",
        state: "",
        zip: "",
        mobile: "",
        delivery_notes: "",
        default_address: false,
    });

    const addAddressHandler = (e) => {
        e.preventDefault();

        setValidateFields(true);
    }

    const addressInputChangeHandler = (e) => {
        setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const defaultAddressCheckHandler = (e) => {
        setAddress((prev) => ({ ...prev, default_address: !prev.default_address }));
    }


    return (
        <div className="profile-page-content">

            <div className="profile-page-head">Delivery Addresses</div>

            <div className="addresses-container">

                <div onClick={() => { showAddressBtn && setShowAddressBtn(false) }} className={`${showAddressBtn ? "inferior-btn" : "addresses-container-head"}`}>+ Add Address</div>

                {!showAddressBtn && (

                    <form onSubmit={addAddressHandler} method="post">

                        <div className="form-instruction" style={{ marginBottom: "8px" }}>*Required fields</div>

                        <div className='input-section'>
                            <label className='label1' htmlFor="first_name">First name*</label>
                            <input
                                onChange={addressInputChangeHandler}
                                className={`${(validateFields && address.first_name.length === 0) ? "invalid" : ""}  input1`}
                                type="text" name="first_name"
                                id="first_name"
                                value={address.first_name}
                            />
                            {(validateFields && address.first_name.length === 0) && (
                                <span className='input-error'>First name is required.</span>
                            )}
                        </div>

                        <div className='input-section'>
                            <label className='label1' htmlFor="last_name">Last name*</label>
                            <input
                                onChange={addressInputChangeHandler}
                                className={`${(validateFields && address.last_name.length === 0) ? "invalid" : ""}  input1`}
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={address.last_name}
                            />
                            {(validateFields && address.last_name.length === 0) && (
                                <span className='input-error'>Last name is required.</span>
                            )}
                        </div>

                        <div className='input-section'>
                            <label className='label1' htmlFor="flat">Flat*</label>
                            <input
                                onChange={addressInputChangeHandler}
                                className={`${(validateFields && flatValidator(address.flat)) ? "invalid" : ""}  input1`}
                                type="text"
                                name="flat"
                                id="flat"
                                value={address.flat}
                            />
                            {(validateFields && flatValidator(address.flat)) && (
                                <span className='input-error'>{flatValidator(address.flat)}</span>
                            )}
                        </div>

                        <div className='input-section'>
                            <label className='label1' htmlFor="street_address">Street Address*</label>
                            <input
                                onChange={addressInputChangeHandler}
                                className={`${(validateFields && streetValidator(address.street_address)) ? "invalid" : ""}  input1`}
                                type="text"
                                name="street_address"
                                id="street_address"
                                value={address.street_address}
                            />
                            {(validateFields && streetValidator(address.street_address)) && (
                                <span className='input-error'>{streetValidator(address.street_address)}</span>
                            )}
                        </div>

                        <div className='input-section'>
                            <label className='label1' htmlFor="landmark">Landmark (optional)</label>
                            <input
                                onChange={addressInputChangeHandler}
                                className={`input1`}
                                type="text"
                                name="landmark"
                                id="landmark"
                                value={address.landmark}
                            />
                        </div>

                        <div className='input-section'>
                            <label className='label1' htmlFor="city">City*</label>
                            <input
                                onChange={addressInputChangeHandler}
                                className={`${(validateFields && cityValidator(address.city)) ? "invalid" : ""}  input1`}
                                type="text"
                                name="city"
                                id="city"
                                value={address.city}
                            />
                            {(validateFields && cityValidator(address.city)) && (
                                <span className='input-error'>{cityValidator(address.city)}</span>
                            )}
                        </div>

                        <div className='single-line'>
                            <div className='input-section'>
                                <label className='label1' htmlFor="state">State*</label>
                                <input 
                                    onChange={addressInputChangeHandler} 
                                    className={`${(validateFields && stateValidator(address.state)) ? "invalid" : ""}  input1`}
                                    type="text" 
                                    name="state" 
                                    id="state" 
                                    value={address.state} 
                                />
                                {(validateFields && stateValidator(address.state)) && (
                                    <span className='input-error'>{stateValidator(address.state)}</span>
                                )}
                            </div>

                            <div className='input-section'>
                                <label className='label1' htmlFor="zip">Zip Code*</label>
                                <input
                                    onChange={addressInputChangeHandler}
                                    className={`${(validateFields && zipValidator(address.zip)) ? "invalid" : ""}  input1`}
                                    type="number"
                                    name="zip"
                                    id="zip"
                                    value={address.zip}
                                />
                                {(validateFields && zipValidator(address.zip)) && (
                                    <span className='input-error'>{zipValidator(address.zip)}</span>
                                )}
                            </div>
                        </div>

                        <div className='input-section'>
                            <label className='label1' htmlFor="mobile">Mobile Number*</label>
                            <input
                                onChange={addressInputChangeHandler}
                                className={`${(validateFields && mobileNumValidator(address.mobile)) ? "invalid" : ""}  input1`}
                                type="number"
                                name="mobile"
                                id="mobile"
                                value={address.mobile}
                            />
                            {(validateFields && mobileNumValidator(address.mobile)) && (
                                <span className='input-error'>{mobileNumValidator(address.mobile)}</span>
                            )}
                            <span className="input-caption">We'll contact you in case anything comes up with your order.</span>
                        </div>

                        <div className='input-section'>
                            <label className='label1' htmlFor="delivery_notes">Delivery Notes</label>
                            <textarea 
                                onChange={addressInputChangeHandler} 
                                className='textarea1' 
                                type="text" 
                                name="delivery_notes" 
                                id="delivery_notes" 
                                value={address.delivery_notes}
                            />
                            <span className="input-caption" style={{ alignSelf: "flex-end" }}>{address.delivery_notes.length}/250</span>
                        </div>

                        <div className='checkboxes'>
                            <input onClick={defaultAddressCheckHandler} type="checkbox" name="default_address" id="default_address" checked={address.default_address} readOnly />
                            <label htmlFor="default_address">
                                Set as my default address
                            </label>
                        </div>

                        <div className="btn-container">
                            <button onClick={() => { setShowAddressBtn(true) }} className='inferior-btn' type="submit">Cancel</button>
                            <button className='main-btn' type="submit">Save</button>
                        </div>

                    </form>)}

            </div>
        </div>
    )
}

export default Addresses
