import axios from "axios"


export const getProductDetails = async({ queryKey }) => {
    try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/${queryKey[1]}`);
        return data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}