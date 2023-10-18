import React, { useEffect } from 'react';
import ProductsCarousel from '../layouts/Carousel/ProductsCarousel.jsx';
import MetaData from "../Metadata.jsx";
import './Home.css';
import { actionCreators, navigationActionCreators } from '../../State/action-creators/index.js';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/Loader/Loader.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {

    const dispatch = useDispatch();
    const { loading, products, error } = useSelector(
        (state) => state.products
    );

    const { getProducts } = bindActionCreators(actionCreators, dispatch);

    const { setKeyword, setMinPrice, setMaxPrice, setPage, setCategory, setBrand, setAvailability } = bindActionCreators(navigationActionCreators, dispatch);

    useEffect(()=> {
        toast.error(error, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [error]);


    useEffect(()=> {

        // let isCalled = false;

        // const onScroll = () => {
        //     if(window.scrollY > 100 && !isCalled){


        setKeyword("");
        setAvailability("");
        setBrand("");
        setCategory("");
        setMaxPrice(0);
        setMinPrice(0);
        setPage(0);

        getProducts();



            //         isCalled = true
            //     }
            // }
            
            // window.addEventListener("scroll", onScroll)
            
            // return () => {
            //         window.removeEventListener("scroll", onScroll);
            // }
            // eslint-disable-next-line
    }, [])

    return (
        <>
            { loading ? <Loader /> : (
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
                        <ProductsCarousel products={products} heading="Featured Products" caption="Upto 60% Off" />
                    </section>
                </>

            )}
        </>
    )
}

export default Home;