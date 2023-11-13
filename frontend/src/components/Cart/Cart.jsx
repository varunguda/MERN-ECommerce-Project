import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./Cart.css";
import Accordion from '../elements/Accordians/Accordion';
import { addToCart } from '../../State/action-creators/CartActionCreators';
import { Link, useNavigate } from 'react-router-dom';
import IconChevronRight from '@tabler/icons-react/dist/esm/icons/IconChevronRight';
import IconPlus from '@tabler/icons-react/dist/esm/icons/IconPlus';
import IconMinus from '@tabler/icons-react/dist/esm/icons/IconMinus';
import Metadata from '../Metadata';
import BannerPage from '../layouts/Banner/BannerPage';


const Cart = () => {

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [prodQuantities, setProdQuantities] = useState({});

    useEffect(() => {
        window.scrollTo(0,0);
    }, [])

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

    const removeItem = (id) => {
        dispatch(addToCart(id, 0));
    }

    const totalSavings = cartItems.reduce((c, i) => c + (i.price - i.final_price), 0);
    const totalItemsFinalPrice = cartItems.reduce((c, i) => c + i.final_price, 0);
    const shippingCost = totalItemsFinalPrice > 500 ? 0 : 100;
    const estimatedTotalPrice = totalItemsFinalPrice + shippingCost;

    const checkoutClickHandler = () => {
        navigate("/account/login?redirect=shipping");
    }


    return (
        <>
            {(cartItems.length !== 0) ? (

                <div className='page-container cart-container'>

                    <Metadata title="Cart - ManyIN" />

                    <section className="section section1">

                        <div className="page-head">
                            Cart
                            <span className="cart-quantity"> ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
                        </div>

                        <div className="cart-items-container">

                            <Accordion
                                title={`${cartItems.length} ${cartItems.length === 1 ? "item" : "items"}`}
                                style={{ fontSize: "1.2rem", fontWeight: "700" }}
                                noBorder={true}
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

                                                        <Link
                                                            to={`/product/${item.product}`}
                                                            target='_blank'
                                                            className="icon link"
                                                        >
                                                            <IconChevronRight strokeWidth={1.25} />
                                                        </Link>
                                                    </div>

                                                    <div className="cart-item-price">
                                                        <span className='final-price price'>{item.final_price}</span>
                                                        {(item.final_price !== item.price) && (
                                                            <>
                                                                <span className='total-price price'>
                                                                    {item.price}
                                                                </span>
                                                                <div>
                                                                    <span className='highlight-text'>You save</span>
                                                                    <span className='highlight-price price'>
                                                                        {Math.round(item.price - item.final_price)}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="cart-btn-container">
                                                    <button 
                                                        onClick={() => removeItem(item.product)} 
                                                        type="button" 
                                                        className='inferior-btn'
                                                    >
                                                        Remove
                                                    </button>

                                                    <div className="add-quantity">
                                                        <IconMinus 
                                                            className="minus"
                                                            onClick={() => handleMinusClick(item.product, index)}
                                                            strokeWidth={1.5}
                                                        />
                                                        <span>{prodQuantities[item.product]}</span>
                                                        <IconPlus
                                                            className="plus"
                                                            onClick={() => handlePlusClick(item.product, index)}
                                                            strokeWidth={1.5}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            />
                        </div>
                    </section>


                    <section className="section section2" style={{ marginTop: "57px" }}>

                        <button onClick={checkoutClickHandler} type='button' className="main-btn">Countinue to checkout</button>

                        <section className="cart-price-section">

                            <div className='price-container'>

                                <div>
                                    <span className='bold dark'>Subtotal ({`${cartItems.length} ${cartItems.length === 1 ? "item" : "items"}`})</span>
                                    <span className="dashed price">
                                        {cartItems.reduce((c, i) => c + i.price, 0)}
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
                                    <span>Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="price-container">
                                <div className='dark'>
                                    <span className='bold'>Estimated total</span>
                                    <span className='price bold hl-text'>
                                        {estimatedTotalPrice}
                                    </span>
                                </div>
                            </div>
                        </section>
                    </section>
                </div>
            ) : (
                <BannerPage
                    imageURL="./images/empty-cart.png"
                    caption={
                        <>
                        <span style={{fontWeight: "700", fontSize: "1.2rem"}}>Time to start shopping!</span>
                        <span style={{fontWeight: "600"}}>Your cart is empty</span>
                        <button onClick={() => navigate("/")} className='secondary-btn' type="button">Continue shopping</button>
                        </>
                    }
                />
            )}
        </>
    )
}

export default Cart
