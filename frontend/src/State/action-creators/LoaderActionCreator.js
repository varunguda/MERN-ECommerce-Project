
export const loaderSpin = (bool) => (dispatch) => {
    dispatch({
        type: "LOAD_SPINNER",
        payload: bool,
    })
}