
export const loaderReducer = ( state = { load: false}, action ) => {
    if(action.type === "LOAD_SPINNER"){
        return ({
            load: action.payload,
        });
    }
    else{
        return state;
    }
}