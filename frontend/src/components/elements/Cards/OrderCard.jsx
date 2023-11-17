import React from 'react';
import Icons from '../../Profile/Orders/Icons';
import { formatDate } from '../../Profile/Orders/OrderUtils';
import { Link } from "react-router-dom";


const OrderCard = ({ order, extraSection }) => {
    return (
        <div className='order-cards'>
            {order.order_items.map((item, ind) => {
                return (
                    <div key={ind} className="order-item">
                        <div className="order-status-container">
                            <Icons status={item.product_status} />
                            <div>
                                <p className="order-status">
                                    {item.product_status}
                                </p>
                                <p className="order-date">
                                    On {formatDate(item.ordered_at.slice(0, 10))}
                                </p>
                            </div>
                        </div>

                        <Link to={`/product/${item.product}`} className="order-product link" target='_blank'>
                            <div className="order-image-container">
                                <img src={item.product_img ? item.product_img : "https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"} alt="order-img" />
                            </div>

                            <div className="order-price-inline">
                                <p className="brand">
                                    {item.brand}
                                </p>
                                <p className="name">
                                    {item.name.length > 60 ? item.name.slice(0, 60) + "..." : item.name}
                                </p>
                                <p className="quantity">
                                    quantity: {item.quantity}
                                </p>
                            </div>
                        </Link>
                    </div>
                )
            })}


            <div className="order-section">

                <div className="order-section-heading">Price information</div>

                {order.order_items.map((item, index) => {
                    return (
                        <div key={index} className="price-inline">
                            <p>
                                {item.quantity + " x " + (item.name.length > 60 ? item.name.slice(0, 60) + "..." : item.name)}
                            </p>

                            <p
                                style={{ textDecoration: (item.product_status === "Cancelled") ? "1px line-through" : "none" }}
                            >
                                ₹ {item.final_price * item.quantity}
                            </p>
                        </div>
                    )
                })}


                <div className="price-inline">
                    <p>Total tax price</p>
                    <p
                        style={{ textDecoration: (order.order_items.every(item => item.product_status === "Cancelled")) ? "1px line-through" : "none" }}
                    >
                        ₹ {order.tax_price}
                    </p>
                </div>

                <div className="price-inline">
                    <p>Shipping cost</p>
                    <p
                        style={{ textDecoration: (order.order_items.every(item => item.product_status === "Cancelled")) ? "1px line-through" : "none" }}
                    >
                        ₹ {order.shipping_cost}
                    </p>
                </div>

                <div className="total-price">
                    <p>Total order price</p>
                    <p
                        style={{ textDecoration: (order.order_items.every(item => item.product_status === "Cancelled")) ? "1px line-through" : "none" }}
                    >
                        ₹ {order.total_price}
                    </p>
                </div>
            </div>


            <div className="order-section" style={{ marginTop: "30px" }}>

                <div className="order-section-heading">Delivery Address</div>

                <div className="shipping-details">

                    <p className="name">{`${order.delivery_address.first_name} ${order.delivery_address.last_name}  |  ${order.delivery_address.mobile}`}</p>

                    {`${order.delivery_address.flat}, ${order.delivery_address.street_address}, ${order.delivery_address.city}, ${order.delivery_address.state}, ${order.delivery_address.zip}`}

                </div>
            </div>

            {extraSection}

        </div>
    )
}

export default OrderCard
