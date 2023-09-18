import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Stars from "./Stars.jsx";
import { CiHeart } from "react-icons/ci";

import "./ProductCard.css";

const ProductCard = ({ product, height, width }) => {

  const [quantity, setQuantity] = useState(0);

  const handleWishlistClick = (e) => {
    e.preventDefault();
  }

  const handleAddClick = (e) => {
    e.preventDefault()
    setQuantity(prev => prev + 1);
  }

  const handlePlusClick = (e) => {
    e.preventDefault();
    setQuantity(prev => prev + 1)
  }

  const handleMinusClick = (e) => {
    e.preventDefault();
    setQuantity(prev => prev - 1)
  }

  return (
    <div className='product-card-container' style={{ height, width }}>
      <Link className='product-card' to={`/products/${product._id}`} target='_blank' >

        <div className="image-container">
          <img src={product.images[0]} alt={product.name} />
          <CiHeart onClick={handleWishlistClick} className='wishlist' />
        </div>

        <div className="product-description">

          <div className='product-price'>
            <div className="product-sp">Now ₹{product.final_price}</div>
            <div className="product-p">₹{product.price}</div>
          </div>

          <p>{product.name}</p>

          <div className='review-container'>
            {
              product.rating && (
                <>
                  <Stars value={product.rating} size={window.innerWidth > 600 ? "12px" : "10px"} />
                  <span>{product.total_reviews}</span>
                </>
              )
            }
          </div>

          {
            !quantity ?
              (<button onClick={handleAddClick}><span>+</span> Add</button>)
              :
              (<div className="add-quantity">
                <div className="minus" onClick={handleMinusClick}>-</div>
                <span>{quantity}</span>
                <div className="plus" onClick={handlePlusClick}>+</div>
              </div>)
          }

        </div>

      </Link>
    </div>
  )
}

export default ProductCard;
