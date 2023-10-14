import { ADD_TO_CART } from "../constants/CartConstants";


export const addToCartReducer = ( state = { cartItems: [] }, action ) => {

    switch (action.type) {    
        case ADD_TO_CART:{
            const item = action.payload;

            const isItemExist = state.cartItems.find(i => i.product === item.product);

            if(!isItemExist){
                return ({
                    ...state,
                    cartItems: [...state.cartItems, item]
                });
            }

            return ({
                ...state,
                cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i),
            });
        }
    
        default:{
            return state;
        }
    }
}