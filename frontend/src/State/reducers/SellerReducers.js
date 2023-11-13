import { SELLER_CHECK_FAILURE, SELLER_CHECK_REQUEST, SELLER_CHECK_SUCCESS } from "../constants/SellerConstants"


export const sellerReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case SELLER_CHECK_REQUEST:{
            return {
                checkingSeller: true,
            }
        }

        case SELLER_CHECK_SUCCESS:{
            return {
                checkingSeller: false,
                isSeller: payload.success,
                seller: payload.seller,
            }
        }
        case SELLER_CHECK_FAILURE:{
            return {
                checkingSeller: false,
                isSeller: false,
            }
        }

        default:
            return state;
    }
}
