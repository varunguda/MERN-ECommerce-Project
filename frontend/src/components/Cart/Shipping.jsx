import React, { Fragment, useEffect, useRef, useState } from 'react';
import "./Shipping.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCheckmarkOutline, IoWalletOutline } from "react-icons/io5";
import { LiaShippingFastSolid } from "react-icons/lia"
import Metadata from '../Metadata';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addToCart, getOrderValue } from '../../State/action-creators/CartActionCreators';
import { loaderSpin } from '../../State/action-creators/LoaderActionCreator';
import { closeModal, openModal } from '../../State/action-creators/ModalActionCreator';
import Accordion from '../elements/Accordians/Accordion';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus } from 'react-icons/fi';
import Loader from '../layouts/Loader/Loader';
import AddressForm from '../Profile/Addresses/AddressForm';
import { USER_ADDRESS_ADD_RESET } from '../../State/constants/ProfileConstants';
import { toast } from 'react-toastify';
import { cityValidator, flatValidator, mobileNumValidator, nameValidator, stateValidator, streetValidator, zipValidator } from '../Profile/Addresses/AddressValidators';
import { profileActionCreators } from '../../State/action-creators';
import { bindActionCreators } from 'redux';
import Payment from './Payment';


const Shipping = () => {

    const { cartItems } = useSelector(state => state.cart);
    const {
        gettingOrderVal,
        taxPrice,
        shippingCost,
        finalOrderPrice,
        totalItemsPrice,
        totalItemsFinalPrice,
        totalSavings
    } = useSelector(state => state.orderValue);
    const { addingAddress, addedAddress, addedAddressMessage, addAddressError } = useSelector(state => state.addAddress);
    const { gettingAddresses, addresses } = useSelector(state => state.addresses);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { getUserAddresses, addUserAddress } = bindActionCreators(profileActionCreators, dispatch);

    const [prodQuantities, setProdQuantities] = useState({});
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [validateFields, setValidateFields] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [savedShipping, setSavedShipping] = useState(false);
    const errorRef = useRef(null);
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


    useEffect(() => {
        toast.error(addAddressError, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [addAddressError]);


    useEffect(() => {
        toast.success(addedAddressMessage, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [addedAddressMessage]);


    useEffect(() => {
        window.scrollTo(0, 0);
        getUserAddresses();
        // eslint-disable-next-line
    }, []);


    useEffect(() => {
        if (gettingAddresses) {
            dispatch(loaderSpin(true));
        }
        else {
            dispatch(loaderSpin(false));
        }
        // eslint-disable-next-line
    }, [gettingAddresses]);


    useEffect(() => {
        dispatch(getOrderValue());
        // eslint-disable-next-line
    }, [cartItems]);


    useEffect(() => {
        if (addresses && addresses.length > 0) {
            if (addresses.length === 1) {
                setSelectedAddress(addresses[0]._id);
            }
            else {
                addresses.forEach((address) => {
                    if (address.default_address) {
                        setSelectedAddress(address._id);
                    }
                })
            }
        }
    }, [addresses])


    useEffect(() => {
        if (addedAddress) {
            resetAddressForm();
            dispatch({ type: USER_ADDRESS_ADD_RESET });
            getUserAddresses();
        }
        // eslint-disable-next-line
    }, [addedAddress]);


    useEffect(() => {
        if (cartItems.length > 0) {
            let prodObj = {};
            cartItems.forEach((item) => {
                prodObj[item.product] = item.quantity;
            });

            setProdQuantities(prodObj);
        }
    }, [cartItems]);


    const handlePlusClick = (id, i) => {
        const qty = prodQuantities[id] + 1;
        if (qty > cartItems[i].stock) return;
        if (qty === 13) return;
        setProdQuantities({ ...prodQuantities, [id]: qty });
        dispatch(addToCart(id, qty));
    }

    const handleMinusClick = (id, i) => {
        const qty = prodQuantities[id] - 1;
        if (qty <= 0) return;
        setProdQuantities({ ...prodQuantities, [id]: qty });
        dispatch(addToCart(id, qty));
    }

    const removeItem = (id) => dispatch(addToCart(id, 0));


    const leaveCheckoutClickHandler = () => {
        navigate("/cart");
        dispatch(closeModal());
    }


    const goBackClickHandler = () => {

        dispatch(openModal("You're almost there!",
            <>
                <div className="modal-caption">You'll have to start over if you leave.</div>
                <div className="modal-btn-container">
                    <button className='secondary-btn' onClick={leaveCheckoutClickHandler} type='button'>Leave anyway</button>
                    <button className='main-btn' onClick={() => dispatch(closeModal())} type='button'>Keep checking out</button>
                </div>
            </>,
            true)
        )
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
    };


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

    const handleSelectedAddressChange = (e) => {
        if (e.target.name && selectedAddress !== e.target.name) {
            setSelectedAddress(e.target.name);
        }
    }

    const savedShippingDetailsHandler = () => {
        if (selectedAddress.length !== 0) {
            setSavedShipping(true);
        }
    }



    return (
        <div className="shipping-page-container">

            <Metadata title={"Shipping - ManyIN"} />

            <nav>
                <IoIosArrowBack onClick={goBackClickHandler} className='nav-icon' />
                Checkout
            </nav>

            <div className='page-container' style={{ marginTop: "40px" }}>

                <section className='section section1'>

                    <div className="step step1">
                        <div className="head">
                            <LiaShippingFastSolid size={30} />
                            1. Shipping
                        </div>

                        <div className="step-content">

                            <div className="shipping-address-container">
                                <div>
                                    <p>Shipping address</p>
                                    <p>Where should we deliver your order?</p>
                                </div>


                                {(savedShipping === true) && !gettingAddresses && (
                                    addresses.map((address, index) => {
                                        return (address._id === selectedAddress) && (
                                            <Fragment key={index}>

                                                <div className="saved-shipping-address">
                                                    <div className="name">{address.first_name + " " + address.last_name}</div>

                                                    <div className="address">{`${address.flat}, ${address.street_address}, ${address.city}, ${address.state}, ${address.zip}`}</div>

                                                    {address.default_address && (
                                                        <div className="default-check">
                                                            <IoCheckmarkOutline color='green' />
                                                            Default address
                                                        </div>
                                                    )}
                                                </div>

                                                <button onClick={() => { setSavedShipping(false) }} className='inferior-btn edit-btn'>Edit</button>
                                            </Fragment>
                                        )
                                    })
                                )}


                                {!showAddAddressForm && !savedShipping && (<button onClick={() => setShowAddAddressForm(prev => !prev)} className='inferior-btn'>+ Add a new address</button>)}


                                {(!showAddAddressForm && !gettingAddresses && !savedShipping) && (
                                    <div className="shipping-addresses-checkboxes">
                                        {addresses.map((address, index) => {
                                            return (<div key={index} className="checkboxes">
                                                <input
                                                    type="checkbox"
                                                    name={address._id}
                                                    checked={selectedAddress === address._id}
                                                    onChange={handleSelectedAddressChange}
                                                    id={address._id}
                                                />
                                                <label htmlFor={address._id}>
                                                    <div className='address-label'>
                                                        <div className="name">{address.first_name + " " + address.last_name}</div>

                                                        <div className="address">{`${address.flat}, ${address.street_address}, ${address.city}, ${address.state}, ${address.zip}`}</div>

                                                        {address.default_address && (
                                                            <div className="default-check">
                                                                <IoCheckmarkOutline color='green' />
                                                                Default address
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            </div>)
                                        })}
                                    </div>
                                )}


                                {showAddAddressForm && (
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
                                )}
                            </div>


                            {!showAddAddressForm && !savedShipping && (<div className="modal-btn-container" style={{ marginTop: "0px" }}>
                                <button type="button" className='inferior-btn'>Cancel</button>
                                <button type="button" onClick={savedShippingDetailsHandler} className='secondary-btn'>Save</button>
                            </div>)}


                            <Accordion
                                title={"Items details"}
                                style={{ fontSize: "1.1rem", fontWeight: "600" }}
                                noBorder={true}
                                close={true}
                                content={
                                    cartItems.map((item, index) => {
                                        return (
                                            <div key={index} className='cart-item'>

                                                <div>
                                                    <div className="cart-item-details link" >
                                                        <Link
                                                            to={`/product/${item.product}`}
                                                            target='_blank'
                                                            className="image-container link"
                                                        >
                                                            <img src={item.image} alt={item.name} />
                                                        </Link>
                                                        <span>{item.name}</span>
                                                    </div>

                                                    <div className="cart-item-price">
                                                        <span className='final-price price'>{item.final_price}</span>
                                                        {(item.final_price !== item.price) && (
                                                            <>
                                                                <span className='total-price price'>{item.price}</span>
                                                                <div>
                                                                    <span className='highlight-text'>You save</span>
                                                                    <span className='highlight-price price'>{Math.round(item.price - item.final_price)}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="cart-btn-container">
                                                    <button onClick={() => removeItem(item.product)} type="button" className='inferior-btn'>Remove</button>
                                                    <button type="button" className='inferior-btn'>Save for later</button>

                                                    <div className="add-quantity">
                                                        <FiMinus className="minus" onClick={() => handleMinusClick(item.product, index)} />
                                                        <span>{prodQuantities[item.product]}</span>
                                                        <FiPlus className="plus" onClick={() => handlePlusClick(item.product, index)} />
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    })
                                }
                            />
                        </div>

                    </div>

                    <div className={`step step2 ${!savedShipping && "inactive"}`}>
                        <div className="head">
                            <IoWalletOutline size={30} />
                            2. Payment method
                        </div>

                        {(savedShipping) && (
                            <Payment cartItems={cartItems} price={finalOrderPrice} address={(addresses.filter((address) => address._id === selectedAddress))[0]} />
                        )}

                    </div>
                </section>


                <section className='section section2'>

                    {gettingOrderVal ? <Loader /> : (
                        <section className="cart-price-section">

                            <div className='price-container'>

                                <div>
                                    <span className='bold dark'>Subtotal ({`${cartItems.length} ${cartItems.length === 1 ? "item" : "items"}`})</span>
                                    <span className="dashed price">
                                        {totalItemsPrice}
                                    </span>
                                </div>

                                {(totalSavings) && (
                                    <div>
                                        <span className='bold'>Savings</span>
                                        <span className="hl-text hl-background">- <span className='price'>
                                            {totalSavings}
                                        </span></span>
                                    </div>
                                )}

                                <div>
                                    <span></span>
                                    <span className='price hl-text bold'>
                                        {totalItemsFinalPrice}
                                    </span>
                                </div>
                            </div>

                            <div className='price-container'>

                                <div>
                                    <span>Shipping</span>
                                    <span className={`hl-text ${shippingCost && "price"}`}>
                                        {shippingCost ? shippingCost : "Free"}
                                    </span>
                                </div>

                                <div className='dark'>
                                    <span className='bold'>Taxes</span>
                                    <span className='price'>{taxPrice}</span>
                                </div>

                            </div>

                            <div className="price-container">
                                <div className='dark'>
                                    <span className='bold'>Estimated total</span>
                                    <span className='price bold hl-text'>
                                        {finalOrderPrice}
                                    </span>
                                </div>
                            </div>

                        </section>
                    )}

                </section>
            </div>
        </div>

    )
}

export default Shipping
