
export const stringValidator = (str, val, min, max, required = true) => {

    if(((val.length === 0) || val.trim() === "") && !required){
        return false;
    }

    if (val.length === 0) {
        return `${str} is required`;
    }

    if (val.trim() === "") {
        return `Enter a valid ${str}`;
    }

    if ((val.length < min) || (val.length > max)) {
        return `${str} must contain atleast ${min} and atmost ${max} chracters`;
    }

    return false;
}


export const numberValidator = (str, val, min, max, required = true) => {

    if(((val.length === 0) || val.trim() === "") && !required){
        return false;
    }

    if (val.length === 0) {
        return `${str} is required`;
    }

    if (val.trim() === "") {
        return `Enter a valid ${str}`;
    }

    if ((val < min) || (val > max)) {
        return `${str} must be in the range ${min} and ${max}`;
    }

    return false;
}


export const categoryValidator = (config, val) => {
    if(!Object.keys(config).includes(val)){
        return "Choose a valid category";
    }
    return false;
}