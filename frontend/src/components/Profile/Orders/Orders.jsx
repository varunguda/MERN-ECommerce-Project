import React, { useEffect, useReducer, useRef, useState } from 'react';
import "./Orders.css";
import { bindActionCreators } from 'redux';
import { profileActionCreators } from '../../../State/action-creators';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { SET_ORDER_KEYWORD, SET_ORDER_PAGE, SET_ORDER_STATUS, SET_ORDER_TIME } from '../../../State/constants/NavigationConstants';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { TfiSearch } from 'react-icons/tfi';


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

const Orders = () => {

    const [state, dispatch] = useReducer(orderParamsReducer, initialState);

    const { gettingMyOrders, myOrders, myOrdersCount } = useSelector(state => state.myOrders);

    const ordersDispatch = useDispatch();

    const { getUserOrders } = bindActionCreators(profileActionCreators, ordersDispatch);

    const [searchText, setSearchText] = useState("");
    const [stateUpdated, setStateUpdated] = useState(false); // Flag to track state updates
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
        }

    }, [location.search]);


    useEffect(() => {
        if (stateUpdated) {
            getUserOrders(state.keyword, state.status, state.time, state.page);
        }
    }, [state, stateUpdated]);


    useEffect(() => {
        if (gettingMyOrders) {
            ordersDispatch(loaderSpin(true));
        } else {
            ordersDispatch(loaderSpin(false));
        }

        // eslint-disable-next-line
    }, [gettingMyOrders]);


    useEffect(() => {

        const queryParams = [
            state.keyword && `keyword=${encodeURIComponent(state.keyword)}`,
            state.status && `status=${encodeURIComponent(state.status)}`,
            state.time && `time=${encodeURIComponent(state.time)}`,
            state.page && `page=${encodeURIComponent(state.page)}`,
        ].filter(Boolean).join("&");

        if (stateUpdated) {
            navigate(`${queryParams && ('?' + queryParams)}`);
            setStateUpdated(false); // Reset the flag after calling getUserOrders
        }

    }, [state]);


    const searchOrdersHandler = (e) => {
        e.preventDefault();

        if (searchText.trim()) {
            if (state.keyword !== searchText) {
                dispatch({ type: SET_ORDER_KEYWORD, payload: searchText });
            }
            inputRef.current.blur();
        }

    }


    return (
        <div className="profile-page-content">

            <div className="profile-page-head">
                All orders
                <div className="profile-page-caption">from anytime</div>
            </div>

            <div className="orders-container">

                <form onSubmit={searchOrdersHandler} >

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

                </form>

            </div>

        </div>

    )
}

export default Orders
