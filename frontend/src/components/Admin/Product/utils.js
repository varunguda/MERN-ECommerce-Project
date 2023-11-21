
const stringValidator = (str, value, min, max, required = true) => {

    let val = value.toString();

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


const numberValidator = (str, val, min, max, required = true) => {

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


export const inputValidator = (field, str, val, min, max, required = true) => {
    if(["brand", "name", "description", "color", "processor", "size"].includes(field)){
        return stringValidator(str, val, min, max, required);
    }
    else if(["price", "discount_percent", "stock", "ram", "storage", "quantity"].includes(field)){
        return numberValidator(str, val, min, max, required);
    }
}