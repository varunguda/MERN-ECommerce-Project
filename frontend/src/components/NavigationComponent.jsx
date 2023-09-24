
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router';

const NavigationComponent = () => {

    const { keyword, page, minPrice, maxPrice, category, availability, brand } = useSelector((state) => state.urlParams);

    const navigate = useNavigate();

    const queryParams = [
        keyword && `keyword=${encodeURIComponent(keyword)}`,
        minPrice && `pricemin=${encodeURIComponent(minPrice)}`,
        maxPrice && `pricemax=${encodeURIComponent(maxPrice)}`,
        category && `category=${encodeURIComponent(category)}`,
        availability && `availability=${encodeURIComponent(availability)}`,
        brand && `brand=${encodeURIComponent(brand)}`,
        page && `page=${encodeURIComponent(page)}`
    ].filter(Boolean).join('&');

    useEffect(() => {
        navigate(`/products?${queryParams}`)
    }, [keyword, minPrice, maxPrice, category, page, availability, brand, page]);
}

export default NavigationComponent;
