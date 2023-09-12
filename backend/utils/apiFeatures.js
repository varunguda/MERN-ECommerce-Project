export class ApiFeatures{
    constructor(products, queryStr){
        this.products = products,
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        }: {};

        this.products = this.products.find({...keyword});
        return this;
    }

    filter(){
        const { category, pricemin, pricemax } = this.queryStr;
        if(category){
            this.products = this.products.find({category})
        }
        if(pricemin && pricemax){
            this.products = this.products.find({price: { $gte: parseFloat(pricemin), $lte:  parseFloat(pricemax)}})
        }
        return this
    }

    pagination(resultsPerPage){
        const currentPage = this.queryStr.page ? this.queryStr.page : 1;
        const skip = resultsPerPage * (currentPage - 1);

        this.products = this.products.limit(resultsPerPage).skip(skip);
        return this;
    }
}