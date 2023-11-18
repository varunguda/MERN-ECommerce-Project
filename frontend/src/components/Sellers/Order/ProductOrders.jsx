import React, { useContext, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { cancelMyProductOrder, fetchProductOrders, updateOrderStatus } from '../fetchers';
import OrderPageLayout from '../../layouts/OrderPageLayout';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import UpdateOrder from '../../Admin/Orders/UpdateOrder';
import Accordion from '../../elements/Accordians/Accordion';
import IconInfoCircle from '@tabler/icons-react/dist/esm/icons/IconInfoCircle';
import { ModalContext } from '../../../Context/ModalContext';


export const JustificationModalContent = ({ cancelOrderHandler }) => {

    const { closeModal } = useContext(ModalContext);
    const [justification, setJustification] = useState("");
    const errRef = useRef(null);

    const cancelClickHandler = () => {
        if (justification.trim().length >= 10) {
            cancelOrderHandler(justification);
            closeModal();
        }
        else {
            errRef.current.style.display = "flex";
        }
    }


    return (
        <>
            <div className="modal-caption">Please provide the customer with a clear and concise explanation for the inconvenience they have experienced due to your actions. Remember that you may have a significant impact on your merit.</div>

            <div className="input-section">
                <textarea
                    style={{ marginTop: "10px" }}
                    onChange={(e) => { setJustification(e.target.value.slice(0, 400)) }}
                    className='textarea1'
                />
                <span ref={errRef} style={{ display: "none" }} className="input-error">Justification must contain atleat 10 and atmost 400 characters!</span>
            </div>

            <div className="modal-btn-container">
                <button className="inferior-btn" onClick={closeModal}>Abort</button>
                <button className="main-btn warning" onClick={cancelClickHandler}>Cancel Order(s)</button>
            </div>
        </>
    )
}


const ProductOrders = () => {

    const { openModal } = useContext(ModalContext);

    const [params, setParams] = useState({
        keyword: "",
        status: "",
        time: "",
        page: ""
    });

    const dispatch = useDispatch();

    const { data, error, isLoading, refetch, isError } = useQuery(["product orders", params.keyword, params.status, params.time, params.page], fetchProductOrders);
    const updateMutation = useMutation(updateOrderStatus);
    const cancelMutation = useMutation(cancelMyProductOrder);

    useEffect(() => {
        if (isError || updateMutation.isError || cancelMutation.isError) {
            toast.error(((error && error.message) || (updateMutation.error && updateMutation.error.message) || (cancelMutation.error && cancelMutation.error.message)), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            updateMutation.reset();
            cancelMutation.reset();
        }
        // eslint-disable-next-line
    }, [isError, updateMutation.isError, cancelMutation.isError]);

    useEffect(() => {
        if (updateMutation.isSuccess) {
            toast.success((updateMutation.data.message), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            refetch();
            updateMutation.reset();
        }
        // eslint-disable-next-line
    }, [updateMutation.isSuccess]);

    useEffect(() => {
        if (cancelMutation.isSuccess) {
            toast.success((cancelMutation.data.message), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            refetch();
            cancelMutation.reset();
        }
        // eslint-disable-next-line
    }, [cancelMutation.isSuccess]);

    useEffect(() => {
        if (isLoading || updateMutation.isLoading || cancelMutation.isLoading) {
            dispatch(loaderSpin(true));
        } else {
            dispatch(loaderSpin(false));
        }
        // eslint-disable-next-line
    }, [isLoading, updateMutation.isLoading, cancelMutation.isLoading]);


    const paramHandler = (keyword, status, time, page) => {
        setParams({
            keyword,
            status,
            time,
            page
        });
    };

    const updateProductOrderStatus = (order_id, product, status) => {
        updateMutation.mutate({ order_id, product, status });
    };

    const cancelOrderHandler = (order_id, justification) => {
        cancelMutation.mutate({ order_id, justification });
    }

    const cancelClickHandler = (order_id) => {
        openModal("Justification",
            <JustificationModalContent
                cancelOrderHandler={(justification) => cancelOrderHandler(order_id, justification)}
            />,
            true
        );
    }


    return (
        (!isLoading && !!data) && (
            <OrderPageLayout
                gettingOrders={isLoading}
                getOrders={paramHandler}
                orders={data.orders}
                ordersCount={data.ordersCount}
                totalOrdersCount={data.totalOrdersCount}
                orderCardExtraSection={(order) => (
                    <>
                        {!order.order_items.every(item => (item.product_status === "Out for delivery" || item.product_status === "Delivered" || item.product_status === "Cancelled")) && (
                            <div className="cancel-order-section">
                                <div>
                                    <button
                                        className='inferior-btn warning'
                                        type="button"
                                        onClick={() => cancelClickHandler(order._id)}
                                    >
                                        Cancel Order
                                    </button>

                                    <div
                                        className="custom-tooltip light large"
                                        data-tooltip="Cancels all the products in this order that are sold by you."
                                    >
                                        <IconInfoCircle strokeWidth={1.25} size={17} className="icon" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <Accordion
                            title="Update order status"
                            close={true}
                            noBorder={true}
                            content={
                                <UpdateOrder
                                    order={order}
                                    updateOrder={updateProductOrderStatus}
                                    noCancel={true}
                                />
                            }
                        />
                    </>
                )}
            />
        )
    )
}

export default ProductOrders;
