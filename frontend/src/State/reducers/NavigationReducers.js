
const initialState = {
    keyword: "",
    minPrice: 0,
    maxPrice: 0,
    availability: "",
    page: 0,
    category: "",
    brand: "",
    facets: "",
    c_ratings: "",
    sort_by: ""
}

export const navigationReducer = (state = initialState, action) => {

    switch (action.type) {

        case "SET_KEYWORD": {
            return ({ ...state, keyword: action.payload })
        }

        case "SET_MIN_PRICE": {
            return ({ ...state, minPrice: action.payload })
        }

        case "SET_MAX_PRICE": {
            return ({ ...state, maxPrice: action.payload })
        }

        case "SET_PAGE": {
            return ({ ...state, page: action.payload })
        }

        case "SET_CATEGORY": {
            return ({ ...state, category: action.payload })
        }

        case "SET_AVAILABILITY": {
            return ({ ...state, availability: action.payload })
        }

        case "SET_BRAND": {
            return ({ ...state, brand: action.payload })
        }

        case "SET_FACETS": {
            return ({ ...state, facets: action.payload });
        }

        case "SET_RATINGS": {
            return ({ ...state, c_ratings: action.payload })
        }

        case "SET_SORT": {
            return ({ ...state, sort_by: action.payload })
        }

        case "RESET_FACETS": {
            return ({ ...initialState});
        }

        default: {
            return { ...state };
        }
    }
}