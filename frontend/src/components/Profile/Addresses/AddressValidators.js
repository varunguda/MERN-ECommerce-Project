export const nameValidator = (val, str) => {
    if(val.length === 0){
        return `${str} is required`;
    }

    if(val.trim() === ""){
        return `Enter a valid ${str}`;
    }

    return false;
}


export const flatValidator = (val) => {
    if(val.length === 0){
        return "Flat name is required";
    }

    if(val.trim() === ""){
        return "Enter a valid Flat name";
    }

    if(val.length < 5){
        return "Flat name must contain atleast 5 characters";
    }

    return false;
}


export const streetValidator = (val) => {
    if(val.length === 0){
        return "Street address is required";
    }

    if(val.trim() === ""){
        return "Enter a valid Street address";
    }

    if(val.length < 5){
        return "Street address must contain atleast 5 characters";
    }

    return false;
}


export const cityValidator = (val) => {
    if(val.length === 0){
        return "City name is required";
    }

    if(val.trim() === ""){
        return "Enter a valid City name";
    }

    if(val.length < 3){
        return "City name must contain atleast 3 characters";
    }

    return false;
}

export const stateValidator = (val) => {
    if(val.length === 0){
        return "State name is required";
    }

    if((val.length < 3) || (val.trim() === "") ){
        return "Enter a valid State name";
    }

    return false;
}

export const zipValidator = (val) => {
    if(val.toString().length === 0){
        return "Zip code is required";
    }

    if((val.toString().length !== 6) || (val.toString().trim() === "")){
        return "Enter a valid zip code";
    }

    return false;
}


export const mobileNumValidator = (num) => {
    if(num.toString().length === 0){
        return "Mobile number is required";
    }

    const validNumRegex = /^[6789]\d*$/;
    if(!validNumRegex.test(num.toString()) || (num.toString().length !== 10) || (num.toString().trim() === "")){
        return "Enter a valid Mobile number";
    }

    return false;
}