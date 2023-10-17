import axios from "axios";
import { ADD_TO_CART } from "../constants/CartConstants";


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