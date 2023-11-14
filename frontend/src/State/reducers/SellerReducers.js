import { SELLER_CHECK_FAILURE, SELLER_CHECK_REQUEST, SELLER_CHECK_SUCCESS, SELLER_DATA_ANALYSIS_FAILURE, SELLER_DATA_ANALYSIS_REQUEST, SELLER_DATA_ANALYSIS_SUCCESS } from "../constants/SellerConstants"


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



export const sellerAnalysisReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case SELLER_DATA_ANALYSIS_REQUEST:{
            return {
                fetchingAnalysis: true,
            }
        }

        case SELLER_DATA_ANALYSIS_SUCCESS:{
            return {
                fetchingAnalysis: false,
                fetchedAnalysis: payload.success,
                analysis: payload.analysis,
            }
        }

        case SELLER_DATA_ANALYSIS_FAILURE:{
            return {
                fetchingAnalysis: false,
                fetchedAnalysis: payload.success,
            }
        }

        default:
            return state
    }
}
