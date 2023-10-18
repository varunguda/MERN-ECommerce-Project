import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from "react-icons/io";

import "./Shipping.css";
import Metadata from '../Metadata';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { addToCart, getOrderValue } from '../../State/action-creators/CartActionCreators';
import { loaderSpin } from '../../State/action-creators/LoaderActionCreator';
import { closeModal, openModal } from '../../State/action-creators/ModalActionCreator';

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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [prodQuantities, setProdQuantities] = useState({});

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getOrderValue());
    }, []);

    
    useEffect(() => {
        if(gettingOrderVal){
            dispatch(loaderSpin(true));
        }
        else{
            dispatch(loaderSpin(false));
        }
    }, [gettingOrderVal])


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
            <div className="modal-caption">You’ll have to start over if you leave.</div>
            <div className="modal-btn-container">
                <button className='secondary-btn' onClick={leaveCheckoutClickHandler} type='button'>Leave anyway</button>
                <button className='main-btn' onClick={() => dispatch(closeModal())} type='button'>Keep checking out</button>
            </div>
        </>,
        true))
    }


    return (
        <>
            {!gettingOrderVal && (

                <div className="shipping-page-container">

                    <Metadata title={"Shipping - ManyIN"} />

                    <nav>
                        <IoIosArrowBack onClick={goBackClickHandler} className='nav-icon' />
                        Checkout
                    </nav>

                    <div className='page-container' style={{ marginTop: "40px" }}>

                        <section className='section section1'>
                            {/* div. */}
                        </section>

                        <section className='section section2'>

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
                        </section>
                    </div>
                </div>
            )}
        </>

    )
}

export default Shipping
