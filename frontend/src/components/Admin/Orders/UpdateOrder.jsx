import React, { useEffect, useState } from 'react';
import "./UpdateOrder.css";
import { allStatus } from '../../Data';


const UpdateOrder = ({ order, updateOrder, noCancel }) => {

    const [orderStatus, setOrderStatus] = useState([]);

    useEffect(() => {
        if (order && Object.keys(order).length > 0 && order.order_items) {
            for (const item of order.order_items) {
                setOrderStatus(prev => { return prev.concat([{ product: item.product, status: item.product_status }]) });
            }
        }
    }, [order]);


    const saveOrderStatus = (product, product_status, order_id) => {
        if (!orderStatus.find(elem => (elem.product === product) && (elem.status === product_status))) {
            updateOrder(order_id, product, orderStatus.find(elem => elem.product === product).status);
        }
    }

    const statusChangeHandler = (product, e) => {
        setOrderStatus(prev => prev.map((elem) => {
            if (elem.product === product) {
                return { ...elem, status: e.target.value };
            }
            return elem;
        }));
    }


    return (
        (!!orderStatus && orderStatus.length > 0) && (

            order.order_items.map((item, index) => {
                return (
                    <div key={index} className="update-order-status-container">
                        <div className="product">
                            {item.quantity} x {item.name.slice(0, 20)}...
                        </div>

                        <div className='order-status'>
                            <span>Order Status: </span>
                            <select
                                className='input1'
                                name="order-status"
                                value={orderStatus[index].status}
                                onChange={(e) => statusChangeHandler(item.product, e)}
                            >
                                {Object.keys(allStatus).slice(1).map((status, index) => {
                                    return (
                                        (noCancel ? (allStatus[status] !== "Cancelled") : true) && (
                                            <option key={index} value={allStatus[status]}>
                                                {allStatus[status]}
                                            </option>

                                        )
                                    )
                                })}
                            </select>
                        </div>

                        <div className="btn-container">
                            <button
                                type="button"
                                className='inferior-btn'
                                disabled={item.product_status === orderStatus[index].status}
                                onClick={() => saveOrderStatus(item.product, item.product_status, order._id)}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                )
            })
        )
    )
}

export default UpdateOrder
