import React, { useEffect, useRef, useState } from 'react';
import "./ProductPage.css";
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from "../../State/action-creators";
import { addToCart } from '../../State/action-creators/CartActionCreators';
import { useLocation } from 'react-router';
import Metadata from '../Metadata';
import IconZoomIn from '@tabler/icons-react/dist/esm/icons/IconZoomIn';
import IconStore from '@tabler/icons-react/dist/esm/icons/IconBuildingStore';
import IconChevronRight from '@tabler/icons-react/dist/esm/icons/IconChevronRight';
import IconChevronLeft from '@tabler/icons-react/dist/esm/icons/IconChevronLeft';
import IconPlus from '@tabler/icons-react/dist/esm/icons/IconPlus';
import IconMinus from '@tabler/icons-react/dist/esm/icons/IconMinus';
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
import { useQuery } from "react-query";
import { getProductDetails } from './fetchers';
import NotFoundPage from '../NotFoundPage';
import { categoryConfig } from '../Data';


const ProductPage = () => {

    const { sellersProducts } = useSelector(state => state.sellerProducts);
    const { productReview } = useSelector(state => state.productReviews);
    const { bundles } = useSelector(state => state.bundleProducts);
    const { cartItems } = useSelector(state => state.cart);

    const [currentImageIndex, setCurrentIndex] = useState(0);
    const [activeImageIndex, setActiveImageIndex] = useState(currentImageIndex);
    const [hoverImageIndex, setHoverImageIndex] = useState(activeImageIndex);
    const [origin, setOrigin] = useState('50% 50%');
    // const [selectedPlan, setSelectedPlan] = useState('No Plan');
    const [zoom, setZoom] = useState(1);
    const [quantity, setQuantity] = useState(0);
    const [product, setProduct] = useState({});
    const [variation_products, setVariationProducts] = useState({});
    const reviewRef = useRef(null);

    const location = useLocation();
    const dispatch = useDispatch();

    const { getAllProductsOfSeller, getBundleProducts, getProductReviews } = bindActionCreators(actionCreators, dispatch);

    const { isLoading, data, error } = useQuery(["Product Deatils", location.pathname.replace("/product/", "")], getProductDetails, {
        refetchInterval: false,
        retry: false,
    });


    useEffect(() => {
        if (!!data) {
            setVariationProducts(data.variation_products);
            setProduct(data.product);
        }
        // eslint-disable-next-line
    }, [data]);

    useEffect(() => {
        if (!!error) {
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
        }
    }, [error]);

    useEffect(() => {
        if (!!product.seller_id) {
            getAllProductsOfSeller(product.seller_id);
        }
        // eslint-disable-next-line
    }, [product.seller_id]);

    useEffect(() => {
        if (!!product && Object.keys(product).length > 0) {
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

        return () => {
            setActiveImageIndex(0);
            setCurrentIndex(0);
            setHoverImageIndex(0);
        }
        // eslint-disable-next-line
    }, [product]);

    useEffect(() => {
        if (isLoading) {
            dispatch(loaderSpin(true));
        }
        else {
            dispatch(loaderSpin(false));
        }

        // eslint-disable-next-line
    }, [isLoading]);

    useEffect(() => {
        setActiveImageIndex(currentImageIndex);
    }, [currentImageIndex]);

    useEffect(() => {
        setHoverImageIndex(activeImageIndex);
    }, [activeImageIndex])


    const getImageIndex = (images, image) => {
        for (let i = 0; i < images.length; i++) {
            if (images[i].image_url === image) {
                return i;
            }
        }
    }

    const handleImageClick = (e) => {
        let index = getImageIndex(product.images, e.target.src);
        setCurrentIndex(index);
    }

    const handleHoverOn = (e) => {
        let index = getImageIndex(product.images, e.target.src);
        setHoverImageIndex(index);
    }

    const handleHoverOff = (e) => {
        setHoverImageIndex(activeImageIndex);
    }

    const handlePrevImageClick = () => {
        if (product.images[currentImageIndex - 1]) {
            setCurrentIndex(prev => prev - 1);
        }
    }

    const handleNextImageClick = () => {
        if (product.images[currentImageIndex + 1]) {
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
            {(!!product && (Object.keys(product).length > 0) && !isLoading) ? (

                <div className='product-page-container'>
                    <Metadata
                        title={(product.name.length > 80) ? (product.name.slice(0, 80) + "...") : product.name}
                    />

                    <section className="page-section">
                        <section className="page-column1">
                            <div className="product-images">
                                <div className="image-carousel">
                                    {product.images.map((url, index) => (
                                        <div key={index} className={(product.images[activeImageIndex] && (product.images[activeImageIndex].image_url === (url.image_url))) ? "image-wrapper active" : "image-wrapper"}>
                                            <img
                                                onClick={handleImageClick}
                                                onMouseEnter={handleHoverOn}
                                                onMouseLeave={handleHoverOff}
                                                src={url.image_url}
                                                alt="carousel-img"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div onClick={handlePrevImageClick} className={`image-btn prev-image ${!product.images[currentImageIndex - 1] ? "disabled" : ""} `} disabled={true} >
                                    <IconChevronLeft size={30} />
                                </div>
                                <div
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove} className="product-image"
                                >

                                    <img onClick={handleMainImageClick} style={{ transformOrigin: origin, transform: `scale(${zoom})` }} src={product.images[hoverImageIndex] && product.images[hoverImageIndex].image_url} alt="product-img" />

                                </div>
                                <div onClick={handleNextImageClick} className={`image-btn next-image ${!product.images[currentImageIndex + 1] ? "disabled" : ""} `}>
                                    <IconChevronRight size={30} />
                                </div>
                            </div>

                            <div className='image-caption'>
                                <div className='zoom-caption'>Roll over image to zoom in</div>
                                <IconZoomIn className='zoom-icon' size={30} strokeWidth={1.25} />
                            </div>

                            <div className="quick-highlights">
                                <div className="heading">Quick highlights</div>
                                <div className="highlight-section">
                                    <div className="elem elem1">
                                        <span className="highlight-name">Brand</span><span className="highlight-text">{product.brand}</span>
                                    </div>
                                    <div className="elem elem2">
                                        <span className="highlight-name">Category</span><span className="highlight-text">{product.category}</span>
                                    </div>

                                    {categoryConfig[product.category].properties.map((field, index) => (
                                        (!!product[field] && ((index) < 5)) && (
                                            <div className={`elem elem${index + 3}`}>
                                                <span className="highlight-name">{field}</span>
                                                <span className="highlight-text">{product[field]}</span>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>

                            <div className="about-product">
                                <div className="heading">
                                    About this item
                                </div>
                                <Accordion
                                    title="Product description"
                                    content={product.description}
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
                                                                noReviews={true}
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

                            {(!!sellersProducts && sellersProducts.length > 0) && (
                                <ProductsCarousel
                                    products={sellersProducts}
                                    desktopItems={4}
                                    tabletItems={3}
                                    flipItems={2}
                                    mobileItems={1}
                                    heading="More products from the seller"
                                    noReviews={true}
                                />
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
                                        {(product.final_price !== product.price) && (
                                            <div className="price-p">₹{product.price}</div>
                                        )}
                                    </div>

                                    {!!product.discount_percent && (
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
                                                <IconMinus strokeWidth={1.5} className="minus" onClick={handleMinusClick} />
                                                <span>{quantity}</span>
                                                <IconPlus strokeWidth={1.5} className="plus" onClick={handlePlusClick} />
                                            </div>)
                                        }
                                    </div>
                                </div>

                                {(!!variation_products && variation_products.length > 0) && (
                                    <ProductVariations variationProducts={variation_products.concat([product])} mainProduct={product} images={product.images} />
                                )}

                                <div className="seller-details">
                                    <div className="about-seller">
                                        <IconStore className='icon' size={20} strokeWidth={1} />
                                        Sold by <span className="seller-name">{product.seller_name}</span>
                                    </div>
                                    {product.seller_merit && (
                                        <div className="merit"><span>{product.seller_merit}</span> - Seller Merit</div>
                                    )}
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
            ) : (
                (!isLoading && !!error) && (
                    <NotFoundPage />
                )
            )}
        </>
    )
}

export default ProductPage;



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