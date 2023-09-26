export class ApiFeatures{

    constructor(products, queryStr){
        this.products = products,
        this.queryStr = queryStr
    }

    search(){
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
        }: {};

        this.products = this.products.find({ ...keyword });
        return this;
    }

    filter(){
        const { category, pricemin, pricemax, brand, availability } = this.queryStr;
        if(category){
            this.products = this.products.find({category})
        }
        if(brand){
            let brandArr = brand.split(",")
            this.products = this.products.find({ brand: { $in: brandArr } })
        }
        if(pricemin){
            this.products = this.products.find({final_price: { $gte: parseFloat(pricemin) }})
        }
        if(pricemax){
            this.products = this.products.find({final_price: { $lte:  parseFloat(pricemax) }})
        }
        if(!availability || availability !== "oos"){
            this.products = this.products.find({ stock: {$ne: 0} });
        }
        return this;
    }
}


export const pagination = (products, resultsPerPage, page) => {
    const currentPage = page || 1;
    const skip = resultsPerPage * (currentPage - 1);

    products = products.slice(skip, skip + resultsPerPage)
    return products;
}