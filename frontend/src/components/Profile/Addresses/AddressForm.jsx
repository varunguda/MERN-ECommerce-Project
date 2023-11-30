import React, { useEffect, useState } from 'react';
import {
    cityValidator,
    flatValidator,
    mobileNumValidator,
    nameValidator,
    stateValidator,
    streetValidator,
    zipValidator
} from './AddressValidators.js';
import Loader2 from '../../layouts/Loader/Loader2.jsx';


const AddressForm = ({ onSubmit, address, setAddress, disableSaveBtn, validateFields, cancelClickHandler, module }) => {

    const [formModule, setFormModule] = useState({
        State: null,
        City: null
    });

    useEffect(() => {
        const importCountryStateCity = async () => {
            const importedModule = await import("country-state-city");
            const { State, City } = importedModule;
            setFormModule({
                State,
                City
            });
        };

        if (!module) {
            importCountryStateCity();
        } else {
            setFormModule(module);
        }
    }, [module]);

    const addressInputChangeHandler = (e) => {
        const maxLength = {
            first_name: 16,
            last_name: 16,
            flat: 90,
            street_address: 90,
            landmark: 20,
            zip: 6,
            mobile: 10,
            delivery_notes: 250,
        };
        setAddress((prev) => ({
            ...prev,
            [e.target.name]: e.target.value.slice(0, maxLength[e.target.name] ? maxLength[e.target.name] : e.target.value.length)
        }));
    }

    const defaultAddressCheckHandler = () => {
        setAddress((prev) => ({ ...prev, default_address: !prev.default_address }));
    }

    const setStateCodeHandler = (e) => {
        formModule.State && formModule.State.getStatesOfCountry("IN").forEach((state) => {
            if (state.name === e.target.value) {
                setAddress((prev) => ({ ...prev, state_code: state.isoCode }))
            }
        })
    }


    return (
        (!!formModule.State || !!formModule.City) ? (

            <form onSubmit={onSubmit} method="post">

                <div className="form-instruction" style={{ marginBottom: "8px" }}>*Required fields</div>

                <div className='input-section'>
                    <label className='label1' htmlFor="first_name">First name*</label>
                    <input
                        onChange={addressInputChangeHandler}
                        className={
                            `${(validateFields && nameValidator(address.first_name, "First name")) ? "invalid" : ""}  input1`
                        }
                        type="text"
                        name="first_name"
                        id="first_name"
                        spellCheck={false}
                        value={address.first_name}
                    />
                    {(validateFields && nameValidator(address.first_name, "First name")) && (
                        <span className='input-error'>{nameValidator(address.first_name, "First name")}</span>
                    )}
                </div>

                <div className='input-section'>
                    <label className='label1' htmlFor="last_name">Last name*</label>
                    <input
                        onChange={addressInputChangeHandler}
                        className={`${(validateFields && nameValidator(address.last_name, "Last name")) ? "invalid" : ""}  input1`}
                        type="text"
                        name="last_name"
                        id="last_name"
                        spellCheck={false}
                        value={address.last_name}
                    />
                    {(validateFields && nameValidator(address.last_name, "Last name")) && (
                        <span className='input-error'>{nameValidator(address.last_name, "Last name")}</span>
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
                        spellCheck={false}
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
                        spellCheck={false}
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
                        className="input1"
                        type="text"
                        name="landmark"
                        id="landmark"
                        spellCheck={false}
                        value={address.landmark}
                    />
                </div>

                <div className='input-section'>
                    <label className='label1' htmlFor="city">City*</label>
                    <select
                        className='input1'
                        name="city"
                        id='city'
                        onChange={addressInputChangeHandler}
                        spellCheck={false}
                        value={address.city}
                    >
                        <option value=""></option>
                        {!!formModule.City && formModule.City.getCitiesOfState("IN", address.state_code).map((city, index) => {
                            return <option key={index}>{city.name}</option>
                        })}
                    </select>
                    {(validateFields && !!cityValidator(address.city, address.state_code, formModule.City)) && (
                        <span className='input-error'>{cityValidator(address.city, address.state_code, formModule.City)}</span>
                    )}
                </div>

                <div className='input-section'>
                    <label className='label1' htmlFor="state">State*</label>
                    <select
                        className='input1'
                        name="state"
                        id='state'
                        onChange={(e) => { addressInputChangeHandler(e); setStateCodeHandler(e) }}
                        spellCheck={false}
                        value={address.state}
                    >
                        <option value=""></option>
                        {!!formModule.State && formModule.State.getStatesOfCountry("IN").map((state, index) => {
                            return <option key={index}>{state.name}</option>
                        })}
                    </select>
                    {(validateFields && !!stateValidator(address.state, formModule.State)) && (
                        <span className='input-error'>{stateValidator(address.state, formModule.State)}</span>
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
                        spellCheck={false}
                        onWheel={() => document.activeElement.blur()}
                        value={address.zip}
                    />
                    {(validateFields && zipValidator(address.zip)) && (
                        <span className='input-error'>{zipValidator(address.zip)}</span>
                    )}
                </div>

                <div className='input-section'>
                    <label className='label1' htmlFor="mobile">Mobile Number*</label>
                    <input
                        onChange={addressInputChangeHandler}
                        className={`${(validateFields && mobileNumValidator(address.mobile)) ? "invalid" : ""}  input1`}
                        type="number"
                        name="mobile"
                        id="mobile"
                        onWheel={() => document.activeElement.blur()}
                        spellCheck={false}
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
                    <button
                        onClick={cancelClickHandler}
                        className='inferior-btn'
                        type="submit"
                    >
                        Cancel
                    </button>
                    <button
                        className='main-btn'
                        type="submit"
                        disabled={disableSaveBtn}
                    >
                        Save
                    </button>
                </div>
            </form>
        ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Loader2 />
            </div>
        )
    )
}

export default AddressForm
