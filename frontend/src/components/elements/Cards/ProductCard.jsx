import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Stars from "./Stars.jsx";
import { FiMinus, FiPlus } from 'react-icons/fi';
import { addToCart } from '../../../State/action-creators/CartActionCreators.js';
import { useDispatch, useSelector } from 'react-redux';

import "./ProductCard.css";
import ListHeartButton from '../Buttons/ListHeartButton.jsx';


const ProductCard = ({ product, height, width, noreviews = false }) => {

    const [quantity, setQuantity] = useState(0);
    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    useEffect(() => {
        cartItems.forEach(item => {
            if(item.product === product._id){
                setQuantity(item.quantity);
            }
        });
        // eslint-disable-next-line
    }, [product])
    

    const handleWishlistClick = (e) => {
        e.preventDefault();
    }

    const handleAddClick = (e) => {
        e.preventDefault();
        if (quantity >= product.stock) return;
        const qty = quantity + 1;
        setQuantity(qty);
        dispatch(addToCart(product._id, qty));
    }

    const handlePlusClick = (e) => {
        e.preventDefault();
        if (quantity >= product.stock) return;
        const qty = quantity + 1;
        setQuantity(qty);
        dispatch(addToCart(product._id, qty));
    }

    const handleMinusClick = (e) => {
        e.preventDefault();
        if (quantity <= 0) return;
        const qty = quantity - 1;
        setQuantity(qty);
        dispatch(addToCart(product._id, qty));
    }


    return (
        <div className='product-card-container' style={{ height, width }}>
            <Link className='product-card link' to={`/product/${encodeURIComponent(product._id)}`} target='_blank' >

                <div className="image-container">
                    <img src={product.images[0] || "https://images.unsplash.com/photo-1682685797736-dabb341dc7de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} alt={product.name} />

                    <div onClick={handleWishlistClick} className='wishlist'>
                        <ListHeartButton product={product._id} />
                    </div>
                </div>

                <div className="product-description">

                    <div className='product-price'>
                        <div className="product-sp">Now ₹{product.final_price}</div>
                        <div className="product-p">₹{product.price}</div>
                    </div>

                    <p>{product.name}</p>

                    <div className='review-container'>
                        {
                            (noreviews !== true) && (
                                <>
                                    <Stars value={product.rating || 0} size={window.innerWidth > 600 ? "12px" : "10px"} />
                                    <span>{product.total_reviews || 0}</span>
                                </>
                            )
                        }
                    </div>

                    {!quantity ?
                        (<button 
                            onClick={handleAddClick}
                            className='secondary-btn'
                            style={{ padding: "0px 15px", height: "35px" }}
                        >
                            + Add
                        </button>)
                        :
                        (<div className="add-quantity">
                            <FiMinus className="minus" onClick={handleMinusClick} />
                            <span>{quantity}</span>
                            <FiPlus className="plus" onClick={handlePlusClick} />
                        </div>)
                    }

                </div>

            </Link>
        </div>
    )
}

export default ProductCard;
