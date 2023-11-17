import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import "../../Profile/Orders/Orders.css";
import { bindActionCreators } from 'redux';
import { adminActionCreators } from '../../../State/action-creators';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { SET_ORDER_KEYWORD, SET_ORDER_PAGE, SET_ORDER_STATUS, SET_ORDER_TIME } from '../../../State/constants/NavigationConstants';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import IconSearch from '@tabler/icons-react/dist/esm/icons/IconSearch';
import Metadata from '../../Metadata';
import Paginate from '../../elements/Pagination/Paginate';
import { toast } from 'react-toastify';
import { DELETE_UPDATE_ANY_ORDER_RESET } from '../../../State/constants/AdminConstants';
import { ModalContext } from '../../../Context/ModalContext';
import IconInfoCircle from '@tabler/icons-react/dist/esm/icons/IconInfoCircle';
import Accordion from '../../elements/Accordians/Accordion';
import UpdateOrder from './UpdateOrder';
import OrderFilterButton from '../../elements/Buttons/OrderFilterButton';
import OrderCard from '../../elements/Cards/OrderCard';


const orderParamsReducer = (state, action) => {

    switch (action.type) {

        case SET_ORDER_KEYWORD: {
            return ({ ...state, keyword: action.payload });
        }

        case SET_ORDER_STATUS: {
            return ({ ...state, status: action.payload });
        }

        case SET_ORDER_TIME: {
            return ({ ...state, time: action.payload });
        }

        case SET_ORDER_PAGE: {
            return ({ ...state, page: action.payload });
        }

        default: {
            return state;
        }
    }
};


const initialState = {
    keyword: "",
    status: "",
    time: "",
    page: 0
}


const AllOrders = () => {

    const [state, dispatch] = useReducer(orderParamsReducer, initialState);

    const { gettingOrders, orders, ordersCount, totalOrdersCount } = useSelector(state => state.allOrders);
    const { deletingOrUpdatingOrder, deletedOrUpdatedOrder, deletedOrUpdatedMessage, deletedOrUpdatedError } = useSelector(state => state.deleteOrUpdateAnyOrder);

    const { openModal, closeModal } = useContext(ModalContext);

    const ordersDispatch = useDispatch();

    const { getAllOrders, deleteAnyOrder, updateAnyOrderStatus } = bindActionCreators(adminActionCreators, ordersDispatch);

    const [searchText, setSearchText] = useState("");
    const [stateUpdated, setStateUpdated] = useState(false);
    const [navigateUrl, setNavigateUrl] = useState(false);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const setOrderParam = (type, queryValue) => {
        dispatch({
            type,
            payload: queryValue,
        });
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const queryKeyword = queryParams.get("keyword");
        const queryStatus = queryParams.get("status");
        const queryPage = queryParams.get("page");
        const queryTime = queryParams.get("time");

        if (queryKeyword !== null && queryKeyword !== state.keyword) {
            setOrderParam(SET_ORDER_KEYWORD, queryKeyword);
            setSearchText(queryKeyword);
        }
        if (queryStatus !== null && queryStatus !== state.status) {
            setOrderParam(SET_ORDER_STATUS, queryStatus);
        }
        if (queryTime !== null && queryTime !== state.time) {
            setOrderParam(SET_ORDER_TIME, queryTime);
        }
        if (queryPage !== null && queryPage !== state.page) {
            setOrderParam(SET_ORDER_PAGE, parseInt(queryPage, 10));
        }

        if (
            queryKeyword !== state.keyword ||
            queryStatus !== state.status ||
            queryTime !== state.time ||
            queryPage !== state.page
        ) {
            setStateUpdated(true);
            window.scrollTo(0, 0);
        }

        // eslint-disable-next-line
    }, [location.search]);

    useEffect(() => {
        if (stateUpdated) {
            getAllOrders(state.keyword, state.status, state.time, state.page);
            setStateUpdated(false);
        }
        // eslint-disable-next-line
    }, [state, stateUpdated]);

    useEffect(() => {
        if (gettingOrders || deletingOrUpdatingOrder) {
            ordersDispatch(loaderSpin(true));
        } else {
            ordersDispatch(loaderSpin(false));
        }
        // eslint-disable-next-line
    }, [gettingOrders, deletingOrUpdatingOrder]);

    useEffect(() => {
        if (ordersCount < 6) {
            dispatch({ type: SET_ORDER_PAGE, payload: 0 });
            setNavigateUrl(true);
        }
    }, [ordersCount]);

    useEffect(() => {
        toast.error(deletedOrUpdatedError, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [deletedOrUpdatedError]);

    useEffect(() => {
        toast.success(deletedOrUpdatedMessage, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [deletedOrUpdatedMessage]);

    useEffect(() => {
        if (deletedOrUpdatedOrder) {
            ordersDispatch({ type: DELETE_UPDATE_ANY_ORDER_RESET });
            setStateUpdated(true);
        }
        // eslint-disable-next-line
    }, [deletedOrUpdatedOrder]);

    useEffect(() => {
        const queryParams = [
            state.keyword && `keyword=${encodeURIComponent(state.keyword)}`,
            state.status && `status=${encodeURIComponent(state.status)}`,
            state.time && `time=${encodeURIComponent(state.time)}`,
            state.page && `page=${encodeURIComponent(state.page)}`,
        ].filter(Boolean).join("&");

        if (navigateUrl) {
            navigate(`${queryParams && ('?' + queryParams)}`);
            setNavigateUrl(false);
        }
        // eslint-disable-next-line
    }, [navigateUrl]);

    const searchOrdersHandler = (e) => {
        e.preventDefault();

        if (searchText.trim()) {
            if (state.keyword !== searchText) {
                dispatch({ type: SET_ORDER_KEYWORD, payload: searchText });
                setNavigateUrl(true);
            }
            inputRef.current.blur();
        }
        else if ((searchText.trim() !== state.keyword)) {
            dispatch({ type: SET_ORDER_KEYWORD, payload: "" });
            setNavigateUrl(true);
        }
        else {
            setSearchText("");
            inputRef.current.blur();
        }
    }

    const setStatus = (val) => {
        dispatch({ type: SET_ORDER_STATUS, payload: val });
    }

    const setTime = (val) => {
        dispatch({ type: SET_ORDER_TIME, payload: val });
    }

    const setPage = (page) => {
        dispatch({ type: SET_ORDER_PAGE, payload: page });
        setNavigateUrl(true);
    }

    const deleteOrderHandler = (id) => {
        deleteAnyOrder(id);
        closeModal();
    }

    const deleteClickHandler = (id) => {
        openModal(
            "Are you sure you want to Delete this order?",
            (<>
                <div className="modal-caption">Deleting an order leaves no traces in the Seller's or Buyer's order history; the order is completely removed and cannot be located on ManyIN any longer.</div>

                <div className="modal-btn-container">
                    <button onClick={() => closeModal()} className='secondary-btn'>No</button>
                    <button onClick={() => deleteOrderHandler(id)} className='main-btn warning'>Yes</button>
                </div>
            </>)
        );
    }


    return (
        <div className="profile-page-content">

            <Metadata title={"All Orders - ManyIN"} />

            {!gettingOrders && (
                <>
                    <div className="page-head">
                        {allStatus[state.status ? state.status : "all"]} orders
                        <div className="profile-page-caption">from {allTimes[state.time ? state.time : "any"]} on ManyIN</div>
                    </div>

                    <div className="orders-container">

                        <div className="orders-search-filters">

                            <form onSubmit={searchOrdersHandler} className='secondary-search-container' >
                                <input
                                    className='secondary-search'
                                    type="text"
                                    spellCheck="false"
                                    placeholder="Search in orders"
                                    onChange={(e) => {
                                        setSearchText(e.target.value)
                                    }}
                                    value={searchText}
                                    ref={inputRef}
                                />
                                <button className='search-icon' type="submit">
                                    <IconSearch size={15} />
                                </button>
                            </form>

                            <OrderFilterButton
                                state={state}
                                setStatus={(val) => setStatus(val)}
                                setTime={(val) => setTime(val)}
                                setNavigateUrl={setNavigateUrl}
                            />
                        </div>


                        <div className="orders-content">
                            {(orders && orders.length > 0) ? (
                                orders.map((order, index) => {
                                    return (
                                        <OrderCard
                                            key={index}
                                            order={order}
                                            extraSection={
                                                <>
                                                    <div className="cancel-order-section">
                                                        <div>
                                                            <button
                                                                className='inferior-btn warning'
                                                                type="button"
                                                                onClick={() => deleteClickHandler(order._id)}
                                                            >
                                                                Delete Order
                                                            </button>

                                                            <div
                                                                className="custom-tooltip light large"
                                                                data-tooltip="Deleting an order leaves no trace in the Seller's or Buyer's order history; the order is completely removed and cannot be located on ManyIN any longer."
                                                            >
                                                                <IconInfoCircle strokeWidth={1.25} size={17} className="icon" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Accordion
                                                        title={"Update order status"}
                                                        close={true}
                                                        noBorder={true}
                                                        content={
                                                            <UpdateOrder
                                                                order={order}
                                                                updateOrder={updateAnyOrderStatus}
                                                            />
                                                        }
                                                    />
                                                </>
                                            }
                                        />
                                    )
                                })
                            ) : (
                                <>
                                    <div className="content-not-found-container">
                                        <img src="/images/order_not_found.svg" alt="order-not-found" />

                                        {totalOrdersCount === 0 ? (
                                            <>
                                                <p className="main">
                                                    No orders active on ManyIN
                                                </p>
                                                <p className="caption">
                                                    Order section is empty. There aren't any orders placed on ManyIN
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="main">
                                                    Sorry! orders not found
                                                </p>
                                                <p className="caption">
                                                    Try using different filter or go to back to orders
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {(ordersCount && ordersCount > 6) ? (
                            <Paginate onChange={setPage} total={ordersCount} pageSize={6} current={state.page ? state.page : 1} />
                        ) : ""}
                    </div>
                </>
            )}
        </div>
    )
}

export default AllOrders;


const allStatus = {
    "all": "All",
    "delivered": "Delivered",
    "outForDelivery": "Out for delivery",
    "inTransit": "In transit",
    "shipped": "Shipped",
    "processing": "Processing",
    "cancelled": "Cancelled",
}

const allTimes = {
    "any": "Anytime",
    "last30days": "Last 30 days",
    "last6months": "Last 6 months",
    "last1year": "Last year",
    "before1year": "Before an year",
}