export const getAllVariations = (products) => {

    let allVariations = products[0].variations.map((variation) => {
        return variation.name;
    });

    const variations = {};

    allVariations.forEach((variationName) => {
        variations[variationName] = products.reduce((uniqueValues, product) => {
            const value = product[variationName];
            if (!uniqueValues.includes(value)) {
                uniqueValues.push(value);
            }
            return uniqueValues;
        }, []);
    });

    // let allVariantProducts = products.map((product) => {
    //     let variants = allVariations.map((variation) => {
    //         return { [variation]: product[variation] };
    //     });
    //     return { product: product._id, ...variants };
    // });

    const result = {
        variations,
        // products: allVariantProducts
    };

    return result;
};



export const ramFormatter = (num) => {
    if(Number(num) === 16){
        return `${num}GB & Up`
    }
    if(Number(num) === 3){
        return `${num}GB & Under`
    }
    else{
        return `${num}GB`
    }
}


export const storageFormatter = (num) =>{
    if(Number(num) >= 1000){
        return `1TB & Up`
    }
    else{
        return `${num}GB`
    }
}