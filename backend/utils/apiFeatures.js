// export class ApiFeatures{
//     constructor(products, queryStr){
//         this.products = products,
//         this.queryStr = queryStr,
//         this.productsCount = 0
//     }

//     search(){
//         const keyword = this.queryStr.keyword ? {
//             name: {
//                 $regex: this.queryStr.keyword,
//                 $options: "i"
//             }
//         }: {};

//         this.products = this.products.find({...keyword});
//         this.productsCount = this.products.countDocuments();
//         return this;
//     }

//     filter(){
//         const { category, pricemin, pricemax } = this.queryStr;
//         if(category){
//             this.products = this.products.find({category})
//         }
//         if(pricemin && pricemax){
//             this.products = this.products.find({price: { $gte: parseFloat(pricemin), $lte:  parseFloat(pricemax)}})
//         }
//         this.productsCount = this.products.countDocuments();
//         return this;
//     }

//     pagination(resultsPerPage){
//         const currentPage = this.queryStr.page || 1;
//         const skip = resultsPerPage * (currentPage - 1);

//         this.products = this.products.limit(resultsPerPage).skip(skip);
//         return this;
//     }
// }





export class ApiFeatures {
    constructor(products, queryStr) {
        this.products = products;
        this.queryStr = queryStr;
        this.productsCount = 0;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};

        this.products = this.products.filter(product => {
            const name = product.name.toLowerCase();
            return name.includes(keyword.name.$regex.toLowerCase());
        });

        this.productsCount = this.products.length;
        return this;
    }

    filter() {
        const { category, pricemin, pricemax } = this.queryStr;
        if (category) {
            this.products = this.products.filter(product => product.category === category);
        }
        if (pricemin && pricemax) {
            this.products = this.products.filter(product => {
                const price = parseFloat(product.price);
                return price >= parseFloat(pricemin) && price <= parseFloat(pricemax);
            });
        }
        this.productsCount = this.products.length;
        return this;
    }

    pagination(resultsPerPage) {
        const currentPage = this.queryStr.page || 1;
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;

        this.products = this.products.slice(startIndex, endIndex);
        return this;
    }
}

const apiFeatures = new ApiFeatures(products, req.query).search().filter().pagination(10);

const products = apiFeatures.products;
const productCount = apiFeatures.productsCount;
