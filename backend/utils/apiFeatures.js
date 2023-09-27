export class ApiFeatures {

    constructor(products, queryStr) {
        this.products = products,
            this.queryStr = queryStr
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            $or: [
                {
                    name: {
                        $regex: this.queryStr.keyword,
                        $options: "i"
                    }
                },
                {
                    brand: {
                        $regex: this.queryStr.keyword,
                        $options: "i",
                    }
                }
            ]
        } : {};

        this.products = this.products.find({ ...keyword });
        return this;
    }

    filter() {
        const { category, pricemin, pricemax, brand, availability, facets } = this.queryStr;
        let query = {};

        if (category) {
            query.category = { $in: category.split(",") };
        }

        if (brand) {
            query.brand = { $in: brand.split(",") };
        }

        if (pricemin) {
            query.final_price = { $gte: parseFloat(pricemin) };
        }

        if (pricemax) {
            query.final_price = { ...query.final_price, $lte: parseFloat(pricemax) };
        }

        if (!availability || availability !== "oos") {
            query.stock = { $ne: 0 };
        }

        if (facets) {

            const facetsArray = facets.split('||');
            console.log(facetsArray);

            facetsArray.forEach(facet => {
                const [key, value] = facet.split(':');

                if(query[key] !== undefined){
                    if(!Array.isArray(query[key])){
                        query[key] = [value]
                    }
                    query[key].push(value);
                }
                else{
                    query[key] = [value]
                }


                // if (key === '') {
                    query = {
                        $and: [
                            { $and: [ { ram: { $eq: 32 } }, { ram: { $gte: 16 } } ] },
                            { storage: { $gte: 1000 } }
                        ]
                    }
                // }
            })
        }

        this.products = this.products.find(query);

        return this;
    }
}


export const pagination = (products, resultsPerPage, page) => {
    const currentPage = page || 1;
    const skip = resultsPerPage * (currentPage - 1);

    products = products.slice(skip, skip + resultsPerPage)
    return products;
}