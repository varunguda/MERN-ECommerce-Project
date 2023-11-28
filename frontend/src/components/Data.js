
export const allStatus = {
    "all": "All",
    "delivered": "Delivered",
    "outForDelivery": "Out for delivery",
    "inTransit": "In transit",
    "shipped": "Shipped",
    "processing": "Processing",
    "cancelled": "Cancelled",
}

export const allTimes = {
    "any": "Anytime",
    "last30days": "Last 30 days",
    "last6months": "Last 6 months",
    "last1year": "Last year",
    "before1year": "Before an year",
}

export const categoryConfig = {

    "Mobile Phone": {
        properties: ["ram", "storage", "color", "processor"]
    },

    "Laptop": {
        properties: ["ram", "color", "processor", "storage", "size"]
    },

    "Monitor": {
        properties: ["color", "size"]
    },

    "Clothing": {
        properties: ["size", "color"]
    },

    "Shoes": {
        properties: ["color", "size"]
    },

    "Watches": {
        properties: ["color"]
    },

    "Telivision": {
        properties: ["color", "size"],
    },

    "Refrigerator": {
        properties: ["color", "size"],
    },

    "Washing Machines": {
        properties: ["color", "size"],
    },

    "Accessories": {
        properties: ["color", "size"],
    },

    "Audio devices": {
        properties: ["color"],
    },

    "Beauty & Health": {
        properties: ["quantity"],
    }
}

export const commonFields = {
    name: "",
    description: "",
    images: [],
    price: "",
    discount_percent: "",
    stock: "",
}

export const allFields = {
    name: "",
    description: "",
    images: [],
    price: "",
    discount_percent: "",
    stock: "",
    color: "",
    size: "",
    storage: "",
    ram: "",
    quantity: "",
    processor: "",
}

export const allFieldsRange = {
    name: [10,250],
    description: [10,1000],
    price: [2,6],
    discount_percent: [0,2],
    stock: [2,6],
    color: [2,40],
    ram: [1,4],
    storage: [1,4],
    processor: [5,100],
    size: [1,10],
    quantity: [1,4]
};
