
export const openModal = (heading, content) => (dispatch) => {
    dispatch({
        type: "open",
        payload: {
            heading: heading || "Modal Window",
            content: content || "Empty content"
        },
    })
}

export const closeModal = () => (dispatch) => {
    dispatch({
        type: "close",
        payload: {
            heading: "",
            content: ""
        },
    })
}