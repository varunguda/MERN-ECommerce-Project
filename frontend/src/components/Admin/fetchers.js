import axios from "axios";


export const editAnyProductDetails = async({ product,  updatedData}) => {
    try {
        const config = { headers: {"ContentType": "application/json"} };
        const { data } = await axios.put(`/api/v1/admin/products/${product}`, { ...updatedData }, config);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}


export const deleteAnyProduct = async({ product }) => {
    try {
        const { data } = await axios.delete(`/api/v1/admin/products/${product}`);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}