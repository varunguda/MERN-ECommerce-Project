import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from "../../State/action-creators";
import { useParams } from 'react-router';
import Metadata from '../Metadata';
import Loader from '../layouts/Loader/Loader';
import { RxZoomIn } from "react-icons/rx";
import { CiHeart, CiShop } from "react-icons/ci";
import { FcNext, FcPrevious } from "react-icons/fc";

import "./ProductPage.css";
import Stars from '../elements/Cards/Stars';
import { toast } from 'react-toastify';


const images = [
    "https://images.unsplash.com/photo-1539376248633-cf94fa8b7bd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",

    "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",

    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",

    "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",

    "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",

    "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
];


const ProductPage = () => {

    // eslint-disable-next-line
    const { loading, products, error } = useSelector((state) => state.detailedProducts);

    const [currentImageIndex, setCurrentIndex] = useState(0)
    const [activeImageIndex, setActiveImageIndex] = useState(currentImageIndex);
    const [hoverImageIndex, setHoverImageIndex] = useState(activeImageIndex);
    const [origin, setOrigin] = useState('50% 50%');
    const [selectedPlan, setSelectedPlan] = useState('No Plan');
    const [zoom, setZoom] = useState(1);

    const dispatch = useDispatch();

    const { getProductDetails } = bindActionCreators(actionCreators, dispatch);

    const id = useParams();

    useEffect(() => {
        getProductDetails(id);
        // eslint-disable-next-line
    }, []);

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
    }, [error])

    const getImageIndex = (images, image) => {
        for (let i = 0; i < images.length; i++) {
            if (images[i] === image) {
                return i;
            }
        }
    }

    useEffect(() => {
        setActiveImageIndex(currentImageIndex);
    }, [currentImageIndex]);

    useEffect(() => {
        setHoverImageIndex(activeImageIndex);
    }, [activeImageIndex])

    const handleImageClick = (e) => {
        let index = getImageIndex(images, e.target.src);
        setCurrentIndex(index);
    }

    const handleHoverOn = (e) => {
        let index = getImageIndex(images, e.target.src);
        setHoverImageIndex(index);
    }

    const handleHoverOff = (e) => {
        setHoverImageIndex(activeImageIndex);
    }

    const handlePrevImageClick = () => {
        console.log("clicked")
        if (images[currentImageIndex - 1]) {
            setCurrentIndex(prev => prev - 1);
        }
    }

    const handleNextImageClick = () => {
        console.log("clicked")
        if (images[currentImageIndex + 1]) {
            setCurrentIndex(prev => prev + 1);
        }
    }



    const handleMouseEnter = () => {
        setZoom(2); // Adjust this value to change the zoom level
    };

    const handleMouseLeave = () => {
        setZoom(1);
        setOrigin('50% 50%');
    };

    const handleMouseMove = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x}% ${y}%`);
    };


    const handleChange = (event) => {
        setSelectedPlan(event.target.value);
    };


    return (
        <div>
            {
                loading ? <Loader /> : (
                    (products && products[0]) && (
                        <div className='product-page-container'>
                            <Metadata
                                title={`${products[0].name.slice(0, 80)}...`}
                            />

                            <section className="page-section1">

                                <section className="product-images">

                                    <div className="image-carousel">

                                        {
                                            images.map((url, index) => (
                                                <div className={images[activeImageIndex] === url ? "image-wrapper active" : "image-wrapper"}>
                                                    <img
                                                        key={index}
                                                        onClick={handleImageClick}
                                                        onMouseEnter={handleHoverOn}
                                                        onMouseLeave={handleHoverOff}
                                                        src={url}
                                                        alt="carousel-img"
                                                    />
                                                </div>
                                            ))
                                        }

                                    </div>

                                    <div onClick={handlePrevImageClick} className={`image-btn prev-image ${!images[currentImageIndex - 1] ? "disabled" : ""} `} disabled={true} >
                                        <FcPrevious size={30} />
                                    </div>
                                    <div
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onMouseMove={handleMouseMove} className="product-image"
                                    >

                                        <img style={{ transformOrigin: origin, transform: `scale(${zoom})` }} src={images[hoverImageIndex]} alt="product-img" />

                                    </div>
                                    <div onClick={handleNextImageClick} className={`image-btn next-image ${!images[currentImageIndex + 1] ? "disabled" : ""} `}>
                                        <FcNext size={30} />
                                    </div>

                                </section>
                                <div className='caption'>
                                    <div className='zoom-caption'>Roll over image to zoom in</div>
                                    <RxZoomIn className='zoom-icon' size="30px" />
                                </div>
                            </section>

                            <section className="page-section2">

                                <section className="product-detail-section">

                                    <div className="section-part">

                                        <CiHeart className='wishlist-icon' size={30} />

                                        <div className="brand-name">
                                            { products[0].brand }
                                        </div>

                                        <div className="product-name">
                                            {/* Apple Macbook Air 13" - 2022 - Laptop 16GB RAM 128GB SSD Windows 11 Home Laptops with Intel Celeron N4020 Dual-Core Processor FHD 1920x1080, Dual Band Wifi, 2xUSB 3.0, Bluetooth 4.2 */}
                                            {products[0].name}
                                        </div>

                                        <div className="star-rating">
                                            <Stars value={products[0].rating ? products[0].rating : 0 } />
                                            <div className="rating">({products[0].rating})</div>
                                            <div className="reviews-count">
                                                { products[0].total_reviews } reviews
                                            </div>
                                        </div>

                                        <div className="price-container">
                                            <div className="price-sp">Now ₹{`${products[0].final_price}`}</div>
                                            <div className="price-p">₹{`${products[0].price}`}</div>
                                        </div>

                                        {
                                            products[0].discount_percent && (
                                                <div className="save-price">
                                                    <span className='highlight-text'>You save</span>₹{`${Math.round(products[0].price - products[0].final_price)}`}
                                                </div>
                                            )
                                        }

                                        <button className='primary-button'>Add to cart</button>
                                    </div>

                                    <div className="seller-details">
                                        <div className="about-seller">
                                            <CiShop className='icon' size={20} />
                                            Sold by <span className="seller-name">Apple Official</span>
                                        </div>
                                        <div className="merit"><span>90</span> - Seller Merit</div>
                                    </div>

                                    <button className='secondary-button'><CiHeart size={20} />Add to list</button>
                                </section>

                                <section className="more-options">
                                    <div className="section-part">
                                        <div className="option-head">
                                            Protect yout purchase
                                        </div>
                                        <div className="option-description">
                                            Get the best value on product protection including fast repairs or replacements.
                                        </div>

                                        <div className="options">
                                            <div className="checkboxes">
                                                <input type="checkbox" name="plan" value="3-Year Plan" checked={selectedPlan === '3-Year Plan'} onChange={handleChange} id='plan-checkbox1' />
                                                <label htmlFor="plan-checkbox1">3-Year Plan</label>
                                            </div>
                                            <div className="checkboxes">
                                                <input type="checkbox" name="plan" value="2-Year Plan" checked={selectedPlan === '2-Year Plan'} onChange={handleChange} id='plan-checkbox2' />
                                                <label htmlFor="plan-checkbox2">2-Year Plan</label>
                                            </div>
                                            <div className="checkboxes">
                                                <input type="checkbox" name="plan" value="1-Year Plan" checked={selectedPlan === '1-Year Plan'} onChange={handleChange} id='plan-checkbox3' />
                                                <label htmlFor="plan-checkbox3">1-Year Plan</label>
                                            </div>
                                            <div className="checkboxes">
                                                <input type="checkbox" name="plan" value="No Plan" checked={selectedPlan === 'No Plan'} onChange={handleChange} id='no-plan' />
                                                <label htmlFor="no-plan">I don't need protection at this time</label>
                                            </div>
                                        </div>


                                    </div>
                                </section>

                            </section>

                        </div>
                    )
                )
            }
        </div>
    )
}

export default ProductPage
