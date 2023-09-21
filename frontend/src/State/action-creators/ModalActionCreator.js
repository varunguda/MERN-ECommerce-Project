
export const openModal = (heading, content, noOutClick) => (dispatch) => {
    dispatch({
        type: "open",
        payload: {
            heading: heading || "Modal Window",
            content: content || "Empty content",
            noOutClick: noOutClick ? true : false,
        },
    })
}

export const closeModal = () => (dispatch) => {
    dispatch({
        type: "close",
        payload: {
            heading: "",
            content: "",
            noOutClick: false,
        },
    })
}