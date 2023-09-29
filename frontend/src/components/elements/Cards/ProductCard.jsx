import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Stars from "./Stars.jsx";
import { CiHeart } from "react-icons/ci";

import "./ProductCard.css";

const ProductCard = ({ product, height, width, noreviews=false }) => {

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
      <Link className='product-card' to={`/product/${encodeURIComponent(product._id)}`} target='_blank' >

        <div className="image-container">
          <img src={product.images[0] || "https://images.unsplash.com/photo-1682685797736-dabb341dc7de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} alt={product.name} />
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
              !noreviews && (
                <>
                  <Stars value={product.rating || 0} size={window.innerWidth > 600 ? "12px" : "10px"} />
                  <span>{product.total_reviews || 0}</span>
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
