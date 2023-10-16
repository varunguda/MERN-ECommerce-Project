import React from 'react';
import { useSelector } from 'react-redux';

import "./Cart.css";
import Accordion from '../elements/Accordians/Accordion';

const Cart = () => {

    const { cartItems } = useSelector(state => state.cart);

    return (
        <div className='page-container'>
            <div className="cart-section cart-section1">

                <div className="page-head">
                    Cart
                    <span className="cart-quantity"> ({cartItems.length} {cartItems.length === 1 ? "item" : "items" })</span>
                </div>

                <div className="cart-items-container">

                    <Accordion
                        title={`${cartItems.length} ${cartItems.length === 1 ? "item" : "items" }`}
                        style={{ fontSize: "1.2rem", fontWeight: "700" }}
                        noBorder={true}
                        content={
                            <>
                                
                            </>
                        }
                    />
                </div>

            </div>

            mm
        </div>
    )
}

export default Cart
