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
            let ramValues = [];

            facetsArray.forEach(facet => {
                const [key, value] = facet.split(':');


                if (key === 'ram') {
                    ramValues.push(parseInt(value));
                } else if (query[key] !== undefined) {
                    if (!Array.isArray(query[key])) {
                        query[key] = [value]
                    }
                    query[key].push(value);
                }
                else {
                    query[key] = [value]
                }
            })

            if (ramValues.length) {

                if (ramValues.includes(16)) {
                    query['$or'] = [{ 'ram': { $gte: parseInt(16) } }, ...query['$or'] || []];
                }
                if (ramValues.includes(3)) {
                    query['$or'] = [{ 'ram': { $lte: parseInt(3) } }, ...query['$or'] || []];
                }

                let newRamValues = ramValues.filter(value => value !== 16 && value !== 3);

                if (newRamValues.length === 0) {
                    if (query["$or"].length === 1) {
                        query.ram = { ...query['$or'][0]["ram"] }
                        delete query["$or"];
                    }
                }
                else if (newRamValues.length > 0) {
                    if (newRamValues.length === ramValues.length) {
                        query.ram = { $in: newRamValues }
                    }
                    else {
                        query['$or'] = [{ 'ram': { $in: newRamValues } }, ...query['$or'] || []];
                    }
                }

            }
        }

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

        if (query["$or"]) {
            query['$and'] = [{ $or: query["$or"] }, { ...keyword }];
            delete query["$or"];
        }

        this.products = this.products.find(query);
        return this;
    }
}



export const sortBy = (products, sortVal) => {

    switch (sortVal) {
        
        case "phtl":
            return products.sort((a, b) => b.final_price - a.final_price);
        case "plth":
            return products.sort((a, b) => a.final_price - b.final_price);
        case "dhtl":
            return products.sort((a, b) => b.discount_percent - a.discount_percent);
        case "dlth":
            return products.sort((a, b) => a.discount_percent - b.discount_percent);
        case "rhtl":
            return products.sort((a, b) => b.rating - a.rating);
        case "rlth":
            return products.sort((a, b) => a.rating - b.rating);
        case "trhtl":
            return products.sort((a, b) => b.total_reviews - a.total_reviews);
        case "trlth":
            return products.sort((a, b) => a.total_reviews - b.total_reviews);
        case "naz":
            return products.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
        case "nza":
            return products.sort((a, b) => b.name.toUpperCase().localeCompare(a.name.toUpperCase()));
    }

    return products;
}



export const pagination = (products, resultsPerPage, page) => {
    const currentPage = page || 1;
    const skip = resultsPerPage * (currentPage - 1);

    products = products.slice(skip, skip + resultsPerPage)
    return products;
}