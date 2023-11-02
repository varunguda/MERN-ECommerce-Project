

export const setKeyword = (keyword) => (dispatch) => {
    dispatch({
        type: "SET_KEYWORD",
        payload: keyword
    })
}


export const setMinPrice = (minPrice) => (dispatch) => {
    dispatch({
        type: "SET_MIN_PRICE",
        payload: minPrice
    })
}


export const setMaxPrice = (maxPrice) => (dispatch) => {
    dispatch({
        type: "SET_MAX_PRICE",
        payload: maxPrice
    })
}


export const setAvailability = (status) => (dispatch) => {
    dispatch({
        type: "SET_AVAILABILITY",
        payload: status,
    })
}


export const setCategory = (category) => (dispatch) => {
    dispatch({
        type: "SET_CATEGORY",
        payload: category,
    })
}


export const setBrand = (brand) => (dispatch) => {
    dispatch({
        type: "SET_BRAND",
        payload: brand,
    })
}


export const setPage = (page) => (dispatch) => {
    dispatch({
        type: "SET_PAGE",
        payload: page,
    })
}


export const setFacets = (facets) => (dispatch) => {
    dispatch({
        type: "SET_FACETS",
        payload: facets
    })
}


export const setRatings = (rating) => (dispatch) => {
    dispatch({
        type: "SET_RATINGS",
        payload: rating,
    })
}


export const setSort = (val) => (dispatch) => {
    dispatch({
        type: "SET_SORT",
        payload: val,
    })
}


export const resetFacets = () => (dispatch) => {
    dispatch({
        type: "RESET_FACETS"
    })
}