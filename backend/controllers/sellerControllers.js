import { Orders } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";


const productCategories = [
    "Mobile Phone",
    "Laptop",
    "Monitor",
    "Clothing",
    "Shoes",
    "Watches",
    "Telivision",
    "Refrigerator",
    "Washing Machines",
    "Accessories",
    "Audio devices",
    "Beauty & Health",
];


export const sellerDataAnalysis = catchAsync(async (req, res) => {

    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 5, currentDate.getMinutes() + 30);

    let sevenDaysAgo = new Date(currentDate.getTime());
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
        products,
        totalProductsCount,
        orders,
        totalOrdersCount,
    ] = await Promise.all([
        Product.find({ seller_id: req.user._id }),
        Product.countDocuments({ seller_id: req.user._id }),
        Orders.find({
            $and: [
                { "order_items.seller": req.user._id },
                { paid_at: { $gte: sevenDaysAgo, $lte: currentDate } }
            ]
        }),
        Orders.countDocuments({
            $and: [
                { "order_items.seller": req.user._id },
                { paid_at: { $gte: sevenDaysAgo, $lte: currentDate } }
            ]
        }),
    ]);
    

    let productCategoryAnalysis = {};
    productCategories.forEach((category) => {
        productCategoryAnalysis[category] = {
            in_stock: 0,
            out_of_stock: 0,
        }
    });

    products.forEach((product) => {
        if (product.stock > 0) {
            productCategoryAnalysis[product.category].in_stock += 1;
        } else {
            productCategoryAnalysis[product.category].out_of_stock += 1;
        }
    });


    let totalIncomeGenerated = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };
    let totalOrdersPlaced = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };
    let totalOrdersCancelled = {
        "Sunday": 0,
        "Monday": 0,
        "Tuesday": 0,
        "Wednesday": 0,
        "Thursday": 0,
        "Friday": 0,
        "Saturday": 0
    };

    let daysInWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let currentDayIndex = new Date().getDay();

    const rearrangeObject = (obj, currentDayIndex) => {
        let rearrangedObj = {};
        let keys = Object.keys(obj);
        for (let i = 0; i < 7; i++) {
            let index = (currentDayIndex - i + 7) % 7;
            let key = keys[index];
            rearrangedObj[key] = obj[key];
        }

        let reversedObj = {};
        keys = Object.keys(rearrangedObj).reverse();
        for (const key of keys) {
            reversedObj[key] = rearrangedObj[key]
        }

        return reversedObj;
    }

    totalIncomeGenerated = rearrangeObject(totalIncomeGenerated, currentDayIndex);
    totalOrdersPlaced = rearrangeObject(totalOrdersPlaced, currentDayIndex);
    totalOrdersCancelled = rearrangeObject(totalOrdersCancelled, currentDayIndex);

    let last7Days = [];
    for (let i = 0; i < 7; i++) {
        let d = new Date(currentDate);
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split("T")[0]);
    }

    last7Days.forEach((day) => {
        orders.forEach((order) => {
            let orderDate = new Date(order.paid_at);
            orderDate.setHours(orderDate.getHours() + 5);
            orderDate.setMinutes(orderDate.getMinutes() + 30);

            if (orderDate.toISOString().split('T')[0] === day) {
                totalOrdersPlaced[daysInWeek[orderDate.getUTCDay()]] += 1;
            }
            if (orderDate.toISOString().split('T')[0] === day && !order.order_items.every(item => item.product_status === "Cancelled")) {
                totalIncomeGenerated[daysInWeek[orderDate.getUTCDay()]] += order.total_price;
            }
            if (orderDate.toISOString().split('T')[0] === day && order.order_items.every(item => item.product_status === "Cancelled")) {
                totalOrdersCancelled[daysInWeek[orderDate.getUTCDay()]] += 1;
            }
        });
    });

    return res.json({
        success: true,
        analysis: {
            total_products_count: totalProductsCount,
            total_orders_count: totalOrdersCount,
            income_generated: totalIncomeGenerated,
            orders_placed: totalOrdersPlaced,
            orders_cancelled: totalOrdersCancelled,
            products_analysis: productCategoryAnalysis
        }
    })
})