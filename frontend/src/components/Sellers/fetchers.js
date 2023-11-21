import axios from "axios";


export const fetchMyProducts = async ({ queryKey }) => {
    try {
        const { data } = await axios.get(`/api/v1/myproducts?page=${queryKey[1]}`);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const fetchProductOrders = async ({ queryKey }) => {
    try {
        const queryParams = [
            queryKey[1] && `keyword=${queryKey[1]}`,
            queryKey[2] && `status=${queryKey[2]}`,
            queryKey[3] && `time=${queryKey[3]}`,
            queryKey[4] && `page=${queryKey[4]}`
        ].filter(Boolean).join("&");

        const { data } = await axios.get(`/api/v1/myproducts/orders/${queryParams ? '?' + queryParams : ''}`);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const updateOrderStatus = async ({ order_id, product, status }) => {
    try {
        const config = { headers: { "ContentType": "application/json" } };
        const { data } = await axios.put(`/api/v1/myproducts/order?order_id=${order_id}&product=${product}`, { status }, config);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const cancelMyProductOrder = async ({ order_id, justification }) => {
    try {
        const config = {
            data: { justification },
            headers: { headers: { "ContentType": "application/json" } }
        };
        const { data } = await axios.delete(`/api/v1/myproducts/order?order_id=${order_id}`, config);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const cancelAllProductOrders = async({ product, justification }) => {
    try {
        const config = { headers: { "ContentType": "application/json" } };
        const { data } = await axios.put(`/api/v1/myproducts/orders/${product}`, { justification }, config);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const deleteProduct = async({ product }) => {
    try {
        const { data } = await axios.delete(`/api/v1/seller/myproducts/${product}`);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}