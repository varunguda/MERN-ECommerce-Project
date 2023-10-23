import axios from "axios";
import { ADD_TO_CART, ORDER_VALUE_FAILURE, ORDER_VALUE_REQUEST, ORDER_VALUE_SUCCESS  } from "../constants/CartConstants";


export const addToCart = (id, quantity) => async (dispatch, getState) => {

    try {

        const { data } = await axios.get(`/api/v1/product/${id}`);

        dispatch({
            type: ADD_TO_CART,
            payload: {
                product: data.product._id,
                name: data.product.name,
                final_price: data.product.final_price * quantity,
                price: data.product.price * quantity,
                image: data.product.images[0] ? data.product.images[0].url : "https://images.unsplash.com/photo-1488372759477-a7f4aa078cb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                stock: data.product.stock,
                quantity: (quantity <= data.product.stock) ? quantity : data.product.stock,
            },
        });

        localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));

    } catch (error) {
        console.error(error);
    }
}



export const getOrderValue = () => async(dispatch, getState) => {
    try {

        let orderItems = [];

        const state = getState();

        if(state.cart.cartItems.length === 0){
            return;
        }

        state.cart.cartItems.forEach((item) => {
            let obj = {};
            obj.quantity = item.quantity;
            obj.product = item.product;

            orderItems.push(obj);
        });
        
        dispatch({ type: ORDER_VALUE_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axios.post("api/v1/order/getOrderValue", { order_items: orderItems }, config );

        dispatch({
            type: ORDER_VALUE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: ORDER_VALUE_FAILURE,
            payload: error.response.data.message,
        })
    }
}