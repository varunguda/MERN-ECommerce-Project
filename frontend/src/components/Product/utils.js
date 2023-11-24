export const getAllVariations = (products, mainProduct) => {

    const variations = {};

    mainProduct.variations.forEach((variationName) => {
        variations[variationName] = products.reduce((uniqueValues, product) => {
            const value = product[variationName];
            if (!uniqueValues.includes(value)) {
                uniqueValues.push(value);
            }
            return uniqueValues.sort((a, b) => a - b);
        }, []);
    });

    return variations;
};


export const areKeysEqualExceptForKey = (obj1, obj2, keys, excludedKey) => {
    const checkKeys = keys.filter((key) => key !== excludedKey);
    return checkKeys.every((key) => obj1[key] === obj2[key]);
}


export const ramFormatter = (num) => {
    if (Number(num) === 16) {
        return `${num}GB & Up`
    }
    if (Number(num) === 3) {
        return `${num}GB & Under`
    }
    else {
        return `${num}GB`
    }
}


export const storageFormatter = (num) => {
    if (Number(num) >= 1000) {
        return `${num / 1000}TB`
    }
    else {
        return `${num}GB`
    }
}



export const ratingFormatter = (rating) => {
    return `${rating} ${rating === rating.toString() ? "Star" : "Stars"} & up`;
}



export const removeDoublePipe = (str) => {
    while (str.startsWith('||')) {
        str = str.slice(2);
    }

    while (str.endsWith('||')) {
        str = str.slice(0, -2);
    }

    return str;
}



export const reviewTitleValidator = (val) => {
    if (val.length === 0) {
        return `Title is required`;
    }

    if (val.trim() === "") {
        return `Enter a valid title`;
    }

    if (val.length > 50) {
        return `Title must not contain more than 50 characters!`
    }

    return false;
}


export const reviewCommentValidator = (val) => {
    if (val.length === 0) {
        return `Comment is required`;
    }

    if (val.trim() === "") {
        return `Enter a valid comment`;
    }

    if ((val.length > 600) || (val.length < 5)) {
        return `Comment must contain atleast 5 and atmost 600 characters`
    }

    return false;
}


export const reviewRatingValidator = (val) => {
    if (typeof val !== "number") {
        return `Please select a valid rating!`;
    }

    if ((val <= 0) || (val > 5)) {
        return "Please rate your product!";
    }

    return false;
}
