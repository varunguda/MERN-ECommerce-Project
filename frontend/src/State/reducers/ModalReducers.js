
export const modalReducer = (state = false, action) => {

    switch (action.type) {
        case "open": {
            return ({
                open: true,
                content: action.payload.content,
                heading: action.payload.heading,
                noOutClick: action.payload.noOutClick,
            })
        }

        case "close": {
            return({
                open: false,
                content: action.payload.content,
                heading: action.payload.heading,
                noOutClick: action.payload.noOutClick,
            })
        }

        default:{
            return state
        }
    }
}