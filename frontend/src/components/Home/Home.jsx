import React, { useEffect } from 'react';
// eslint-disable-next-line
import ProductsCarousel from '../layouts/Carousel/ProductsCarousel.jsx';
import MetaData from "../Metadata.jsx";
import './Home.css';

import { actionCreators } from '../../State/action-creators/index.js';
import { bindActionCreators } from 'redux';
// eslint-disable-next-line
import { useDispatch, useSelector } from "react-redux";


// const product = {

//     name: `Dell 315, 15.6" HD, Intel Celeron N4000, 4GB RAM, 128GB eMMC, Silver, CB315-3H-C0VT
//     Acer Chromebook 315, 15.6" HD, Intel Celeron N4000, 4GB RAM, 128GB eMMC, Silver, CB315-3H-C0VT`,

//     images: [
//         "https://images.unsplash.com/photo-1593642702909-dec73df255d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
//     ],

//     ratings: 3.6,

//     price: 89200,

//     final_price: 76000,

//     total_reviews: 342,
// }

const Home = () => {

    const dispatch = useDispatch();
    // eslint-disable-next-line
    const { loading, products, error } = useSelector((state) => state.products)

    const { getProducts } = bindActionCreators(actionCreators, dispatch);

    useEffect(() => {
        getProducts();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <MetaData title={"ManyIN - Home"} />

            <div className="banner-container">
                <div className="banner banner1">
                    <span className="text1">Your next phone is</span>
                    <span className="text2">here</span>
                </div>

                <div className="banner banner2">
                    <span className="text1">A shoe.</span>
                    <span className="text2">that's it!</span>
                </div>

                <div className="banner banner3">
                    <span className="text1">Your style at ManyIn</span>
                    <span className="text2">Now Trending</span>
                </div>

                <div className="banner banner4">
                    <span className="text1">Home made better</span>
                    <span className="text2">Home & kitchen appliances at very low prices</span>
                </div>

                <div className="banner banner5">
                    <span className="text1">Fashion,</span>
                    <span className="text2">in your fist</span>
                </div>

                <div className="banner banner6">
                    <span className="text1">Sale & all</span>
                </div>

                <div className="banner banner7">
                    <span className="text1">Sell with us.</span>
                </div>
            </div>


            <section className='content-section'>
                <ProductsCarousel products={products} />
            </section>
        </>
    )
}

export default Home