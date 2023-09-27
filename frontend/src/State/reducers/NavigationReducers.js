
export const navigationReducer = (initialState = {
    keyword: "",
    minPrice: 0,
    maxPrice: 0,
    availability: "",
    page: 0,
    category: "",
    brand: "",
}, action) => {

    switch (action.type) {

        case "SET_KEYWORD": {
            return ({ ...initialState, keyword: action.payload })
        }

        case "SET_MIN_PRICE": {
            return ({ ...initialState, minPrice: action.payload })
        }

        case "SET_MAX_PRICE": {
            return ({ ...initialState, maxPrice: action.payload })
        }

        case "SET_PAGE": {
            return ({ ...initialState, page: action.payload })
        }

        case "SET_CATEGORY": {
            return ({ ...initialState, category: action.payload })
        }

        case "SET_AVAILABILITY": {
            return ({ ...initialState, availability: action.payload })
        }

        case "SET_BRAND": {
            return ({ ...initialState, brand: action.payload })
        }

        case "SET_FACETS": {
            return ({...initialState, facets: action.payload });
        }

        default: {
            return { ...initialState };
        }
    }
}