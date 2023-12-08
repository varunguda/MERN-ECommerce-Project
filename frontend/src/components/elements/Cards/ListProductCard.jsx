import React, { useEffect, useState } from 'react';
import "./ListProductCard.css";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getListItems, getListProducts, toggleListItem } from '../../../State/action-creators/UserActionCreators';
import { addToCart } from '../../../State/action-creators/CartActionCreators';


const ListProductCard = ({ product, setTotal }) => {

    const { cartItems } = useSelector(state => state.cart);
    const { listItems } = useSelector(state => state.listItems);

    const [added, setAdded] = useState(false);
    const [ quantity, setQuantity ] = useState(1);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        if (cartItems && cartItems.some((item) => (item.product.toString() === product._id.toString()) && (item.quantity === quantity))) {
            setAdded(true);
        }
        else if (cartItems && !cartItems.some((item) => (item.product.toString() === product._id.toString()) && (item.quantity === quantity))) {
            setAdded(false);
        }
        // eslint-disable-next-line
    }, [cartItems, quantity]);


    useEffect(() => {
        setTotal(prev =>  ({ ...prev, [product._id] : product.final_price * quantity }));
        // eslint-disable-next-line
    }, [quantity]);

    const removeClickHandler = async(e) => {
        e.preventDefault();
        if(listItems && listItems.some((item) => item.toString() === product._id.toString())){
            await dispatch(toggleListItem(product._id));
            dispatch(getListItems());
        }
        dispatch(getListProducts());
    }

    const addToCartHandler = (e) => {
        e.preventDefault();
        if(product.stock > 0){
            dispatch(addToCart(product._id, quantity));
        }
    }

    const quantitySelectHandler = (e) => {
        e.preventDefault();
        setQuantity(Number(e.target.value));
    }


    return (
        <div className={`list-product-card-container ${product.stock === 0 && "low-stock" }`}>
            <div className='list-product-card' >
                <Link className="image-container link"  to={`/product/${encodeURIComponent(product._id)}`} target='_blank'>
                    <img src={product.images && product.images.image_url} alt={product.name} />
                </Link>

                <div className="product-description">
                    <p>{product.name}</p>
                    <p style={{ fontWeight: 600 }}>{product.brand}</p>

                    <div className='product-price'>
                        <div className="product-sp">Now ₹{product.final_price}</div>
                        {(product.final_price !== product.price) && (
                            <div className="product-p">₹{product.price}</div>
                        )}
                    </div>

                    <div className="quantity">
                        <span>quantity: </span>
                        <select 
                            name="quantity" 
                            id="quantity" 
                            value={quantity} 
                            onClick={e => e.preventDefault()}
                            onChange={e => quantitySelectHandler(e)}
                        >
                            {[...Array(product.stock > 12 ? 12 : product.stock)].map((_, index) => {
                                return <option key={index} value={index + 1}>{index + 1}</option>
                            })}
                        </select>
                    </div>

                    <div>
                        <button 
                            onClick={removeClickHandler} 
                            type="button" 
                            style={{ opacity: "1", zIndex: "2" }} 
                            className='inferior-btn'
                        >
                            Remove
                        </button>

                        {added ? (
                            <button
                                className='main-btn'
                                style={{ padding: "0px 15px", height: "35px" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/cart");
                                }}
                            >
                                Go to cart
                            </button>
                        ) : (
                            <button
                                className={`main-btn ${product.stock === 0 && "warning"}`}
                                style={{ padding: "0px 15px", height: "35px", pointerEvents: product.stock === 0 && "none" }}
                                onClick={(e) => addToCartHandler(e)}
                            >
                                {product.stock === 0 ? "Out of stock" : "Add to cart"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListProductCard
