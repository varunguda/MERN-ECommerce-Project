
export const modalReducer = (state = false, action) => {

    switch (action.type) {
        case "open": {
            return ({
                open: true,
                content: action.payload.content,
                heading: action.payload.heading
            })
        }

        case "close": {
            return({
                open: false,
                content: action.payload.content,
                heading: action.payload.heading,
            })
        }

        default:{
            return state
        }
    }
}