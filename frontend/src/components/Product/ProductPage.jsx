import React, { useEffect, useRef, useState } from 'react';
import "./ProductPage.css";
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from "../../State/action-creators";
import { addToCart } from '../../State/action-creators/CartActionCreators';
import { useLocation } from 'react-router';
import Metadata from '../Metadata';
import { RxZoomIn } from "react-icons/rx";
import { CiShop } from "react-icons/ci";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { FiMinus, FiPlus } from "react-icons/fi";
import Stars from '../elements/Cards/Stars';
import { toast } from 'react-toastify';
import ProductVariations from './ProductVariations';
import ProductsCarousel from '../layouts/Carousel/ProductsCarousel';
import Accordion from '../elements/Accordians/Accordion';
import ProductCard from '../elements/Cards/ProductCard';
import ProductReview from './ProductReview';
import { loaderSpin } from '../../State/action-creators/LoaderActionCreator';
import ListButton from '../elements/Buttons/ListButton';
import ListHeartButton from '../elements/Buttons/ListHeartButton';


const images = [
    "https://images.unsplash.com/photo-1539376248633-cf94fa8b7bd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",

    "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",

    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80",

    "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",

    "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",

    "https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
];


// const options = [
//     {
//         name: "SamsungCare+",
//         description: "1 Extended warranty and support",
//         price: 4999,
//         discount_percent: 0,
//         final_price: 4999
//     },
//     {
//         name: "SamsungCare+",
//         description: "2 Extended warranty and support",
//         price: 7999,
//         discount_percent: 0,
//         final_price: 7999
//     },
//     {
//         name: "SamsungCare+",
//         description: "3 Extended warranty and support",
//         price: 9999,
//         discount_percent: 0,
//         final_price: 9999
//     }
// ];


const ProductPage = () => {

    const { loading, product, variation_products, error } = useSelector((state) => state.detailedProducts);
    const { sellersProducts } = useSelector((state) => state.sellerProducts);
    const { productReview } = useSelector((state) => state.productReviews);
    const { bundles } = useSelector((state) => state.bundleProducts);
    const { cartItems } = useSelector((state) => state.cart);

    const [currentImageIndex, setCurrentIndex] = useState(0)
    const [activeImageIndex, setActiveImageIndex] = useState(currentImageIndex);
    const [hoverImageIndex, setHoverImageIndex] = useState(activeImageIndex);
    const [origin, setOrigin] = useState('50% 50%');
    // const [selectedPlan, setSelectedPlan] = useState('No Plan');
    const [zoom, setZoom] = useState(1);
    const [quantity, setQuantity] = useState(0);
    const reviewRef = useRef(null);


    const location = useLocation();
    const dispatch = useDispatch();

    const { getProductDetails, getAllProductsOfSeller, getBundleProducts, getProductReviews } = bindActionCreators(actionCreators, dispatch);

    useEffect(() => {
        getProductDetails(location.pathname.replace("/product/", ""));
        // eslint-disable-next-line
    }, [location.pathname]);


    useEffect(() => {
        toast.error(error, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [error]);


    useEffect(() => {
        if (product && Object.keys(product).length > 0) {
            getAllProductsOfSeller(product.seller_id);

            let found = false;
            cartItems.forEach(item => {
                if (item.product === product._id) {
                    setQuantity(item.quantity);
                    found = true;
                }
            });

            if (!found) {
                setQuantity(0);
            }

            if (product.bundles && product.bundles.length > 0) {
                getBundleProducts(product._id);
            }
        }

        // eslint-disable-next-line
    }, [product]);


    useEffect(() => {
        if (loading) {
            dispatch(loaderSpin(true));
        }
        else {
            dispatch(loaderSpin(false));
        }

        // eslint-disable-next-line
    }, [loading])


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
        if (images[currentImageIndex - 1]) {
            setCurrentIndex(prev => prev - 1);
        }
    }

    const handleNextImageClick = () => {
        if (images[currentImageIndex + 1]) {
            setCurrentIndex(prev => prev + 1);
        }
    }

    const handleMouseEnter = () => {
        setZoom(2);
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

    const handleMainImageClick = () => {
        setZoom(prev => prev > 4 ? 2 : prev + 1);
    }


    // const handleOptionChange = (event) => {
    //     setSelectedPlan(event.target.value);
    // };


    const handleScrollToReviews = () => {
        if (Object.keys(productReview).length === 0) {
            getProductReviews(product._id);
        }

        let scrolled = false;
        setInterval(() => {
            if (reviewRef.current && !scrolled) {
                window.scrollTo(0, reviewRef.current.offsetTop);
                scrolled = true;
            }
        }, 100)
    };


    const handleAddClick = (e) => {
        if (quantity >= product.stock) return;
        const qty = quantity + 1;
        setQuantity(qty);
        dispatch(addToCart(product._id, qty));
    }

    const handlePlusClick = (e) => {
        if (quantity >= product.stock) return;
        const qty = quantity + 1;
        setQuantity(qty);
        dispatch(addToCart(product._id, qty));
    }

    const handleMinusClick = (e) => {
        if (quantity <= 0) return;
        const qty = quantity - 1;
        setQuantity(qty);
        dispatch(addToCart(product._id, qty));
    }


    return (
        <>
            {(product && Object.keys(product).length > 0) && (

                <div className='product-page-container'>
                    <Metadata
                        title={(product.name.length > 80) ? (product.name.slice(0, 80) + "...") : product.name}
                    />

                    <section className="page-section">
                        <section className="page-column1">
                            <div className="product-images">
                                <div className="image-carousel">
                                    {images.map((url, index) => (
                                        <div key={index} className={images[activeImageIndex] === url ? "image-wrapper active" : "image-wrapper"}>
                                            <img
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
                                    <GrFormPrevious size={30} />
                                </div>
                                <div
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove} className="product-image"
                                >

                                    <img onClick={handleMainImageClick} style={{ transformOrigin: origin, transform: `scale(${zoom})` }} src={images[hoverImageIndex]} alt="product-img" />

                                </div>
                                <div onClick={handleNextImageClick} className={`image-btn next-image ${!images[currentImageIndex + 1] ? "disabled" : ""} `}>
                                    <GrFormNext size={30} />
                                </div>
                            </div>

                            <div className='image-caption'>
                                <div className='zoom-caption'>Roll over image to zoom in</div>
                                <RxZoomIn className='zoom-icon' size="30px" />
                            </div>

                            <div className="quick-highlights">
                                <div className="heading">Quick highlights</div>
                                <div className="highlight-section">
                                    <div className="elem elem1">
                                        <span className="highlight-name">Brand</span><span className="highlight-text">{product.brand}</span>
                                    </div>

                                </div>
                            </div>


                            <div className="about-product">
                                <div className="heading">
                                    About this item
                                </div>
                                <Accordion
                                    title="Product details"
                                    content="Eu proident mollit minim occaecat enim et laboris ullamco anim sint.Do ut duis esse ut tempor mollit laborum pariatur magna id laborum ea pariatur.Mollit officia sunt tempor do incididunt nulla do irure nisi voluptate culpa amet adipisicing anim.In veniam ullamco dolore consequat.Tempor velit sit consequat non id nisi Lorem nisi in commodo veniam fugiat.Anim tempor cupidatat veniam nisi laboris esse.Ut dolor aliqua fugiat commodo sunt.Quis excepteur deserunt nulla voluptate adipisicing laborum deserunt est irure nostrud.Fugiat et nostrud consequat ullamco quis adipisicing reprehenderit."
                                />
                                <Accordion
                                    title="Specifications"
                                    content="Eu proident mollit minim occaecat enim et laboris ullamco anim sint.Do ut duis esse ut tempor mollit laborum pariatur magna id laborum ea pariatur.Mollit officia sunt tempor do incididunt nulla do irure nisi voluptate culpa amet adipisicing anim.In veniam ullamco dolore consequat.Tempor velit sit consequat non id nisi Lorem nisi in commodo veniam fugiat.Anim tempor cupidatat veniam nisi laboris esse.Ut dolor aliqua fugiat commodo sunt.Quis excepteur deserunt nulla voluptate adipisicing laborum deserunt est irure nostrud.Fugiat et nostrud consequat ullamco quis adipisicing reprehenderit."
                                />
                                <Accordion
                                    title="Warranty"
                                    content="Eu proident mollit minim occaecat enim et laboris ullamco anim sint.Do ut duis esse ut tempor mollit laborum pariatur magna id laborum ea pariatur."
                                />
                                <Accordion
                                    title="Warnings"
                                    content="Eu proident mollit minim occaecat enim et laboris ullamco anim sint.Do ut duis esse ut tempor mollit laborum pariatur magna id laborum ea pariatur."
                                />
                            </div>


                            {(product.bundles && product.bundles.length > 0) && (bundles && bundles.length > 0) && (
                                <div className="bundles-container">
                                    <div className="heading">Often bought together</div>
                                    <div className="bundles-caption">Get this product at great value in bundles</div>
                                    {bundles.map((bundle, bundleIndex) => (
                                        <div key={bundleIndex} className="bundle-container">
                                            <div className="bundle-name">{bundle.name}</div>
                                            <div className="bundle-description">{bundle.description}</div>
                                            <div className="bundle-products">
                                                {bundle.products.map((product, productIndex) => {
                                                    return (
                                                        <div key={productIndex} className="bundle-product">
                                                            <ProductCard
                                                                height="auto"
                                                                width="180px"
                                                                product={product}
                                                                noreviews={true}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                                <div className="bundle-price">
                                                    <div className="price-sp">Get for ₹{bundle.final_price || bundle.price}</div>
                                                    {bundle.final_price && (
                                                        <div className="price-p">₹{bundle.price}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}


                            {(sellersProducts && sellersProducts.length > 0) && (
                                <ProductsCarousel products={sellersProducts} desktopItems={4} tabletItems={3} flipItems={2} mobileItems={1} heading="More products from the seller" />
                            )}

                            <div ref={reviewRef}>
                                <ProductReview mainProduct={product} />
                            </div>
                        </section>

                        <section className="page-column2">
                            <div className="product-detail-section">
                                <div className="section-part">
                                    <div className="wishlist-icon">
                                        <ListHeartButton product={product._id} size={30} />
                                    </div>

                                    <div className="brand-name">
                                        {product.brand}
                                    </div>

                                    <div className="product-name">
                                        {product.name}
                                    </div>

                                    <div onClick={handleScrollToReviews} className="star-rating">
                                        <Stars
                                            value={product.rating ? product.rating : 0}
                                            size={12}
                                        />
                                        <div className="rating">
                                            {product.rating ? product.rating : "(0)"}
                                        </div>
                                        <div className="reviews-count">
                                            {product.total_reviews ? `${product.total_reviews} reviews` : "No reviews"}
                                        </div>
                                    </div>

                                    <div className="price-container">
                                        <div className="price-sp">Now ₹{product.final_price}</div>
                                        <div className="price-p">₹{product.price}</div>
                                    </div>


                                    {product.discount_percent && (
                                        <div className="save-price">
                                            <span className='highlight-text'>You save</span>
                                            ₹{Math.round(product.price - product.final_price)}
                                        </div>
                                    )}


                                    <div className="btn-container">
                                        {!quantity ?
                                            ((product.stock > 0) ? (
                                                <button onClick={handleAddClick} className='main-btn'>
                                                    Add to cart
                                                </button>
                                            ) : (
                                                <button className='main-btn warning' disabled>
                                                    Out of Stock
                                                </button>
                                            ))
                                            :
                                            (<div className="add-quantity">
                                                <FiMinus className="minus" onClick={handleMinusClick} />
                                                <span>{quantity}</span>
                                                <FiPlus className="plus" onClick={handlePlusClick} />
                                            </div>)
                                        }
                                    </div>
                                </div>

                                {
                                    (variation_products && variation_products.length > 0) && (
                                        <ProductVariations variationProducts={variation_products.concat([product])} mainProduct={product} images={images} />
                                    )
                                }

                                <div className="seller-details">
                                    <div className="about-seller">
                                        <CiShop className='icon' size={20} />
                                        Sold by <span className="seller-name">Apple Official</span>
                                    </div>
                                    <div className="merit"><span>90</span> - Seller Merit</div>
                                </div>

                                <ListButton product={product._id} />
                            </div>

                            {/* {options &&
                                <div className="more-options">
                                    <div className="section-part">
                                        <div className="option-head">
                                            Protect yout purchase
                                        </div>
                                        <div className="option-description">
                                            Secure your product with these options
                                        </div>

                                        <div className="options">
                                            {
                                                options.map((option, index) => {
                                                    return (
                                                        <div key={index} className="checkboxes">
                                                            <input
                                                                type="checkbox"
                                                                name="plan"
                                                                value={option.description}
                                                                checked={selectedPlan === option.description}
                                                                onChange={handleOptionChange}
                                                                id={option.description}
                                                            />
                                                            <label htmlFor={option.description}>{option.description}</label>
                                                        </div>
                                                    )
                                                })
                                            }

                                            <div className="checkboxes">
                                                <input type="checkbox" name="plan" value="No Plan" checked={selectedPlan === 'No Plan'} onChange={handleOptionChange} id='no-plan' />
                                                <label htmlFor="no-plan">I don't need protection at this time</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            } */}
                        </section>
                    </section>
                </div>
            )}
        </>
    )
}

export default ProductPage
