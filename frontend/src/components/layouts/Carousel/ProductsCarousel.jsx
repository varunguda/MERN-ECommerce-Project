import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../../elements/Cards/ProductCard";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowLeft } from "react-icons/md";

import "./ProductCarousel.css"


const CustomLeftArrow = ({ onClick, ...rest }) => {
    return (
        <div {...rest} onClick={onClick} className='left-arrow'>
            <MdOutlineKeyboardArrowLeft size={35} />
        </div>
    );
};

const CustomRightArrow = ({ onClick, ...rest }) => {
    return (
        <div {...rest} onClick={onClick} className='right-arrow'>
            <MdOutlineKeyboardArrowRight size={35} />
        </div>
    );
};


const ProductsCarousel = ({ products }) => {

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6,
            slidesToSlide: 6 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    return (
        <div className='product-carousel'>

            <div className="title">Featured Products</div>
            <div className="caption">Upto 60% off</div>

            <div className="carousel-container">
                <Carousel
                    additionalTransfrom={0}
                    arrows
                    autoPlaySpeed={3000}
                    centerMode={false}
                    className=""
                    containerClass="container"
                    customLeftArrow={<CustomLeftArrow />}
                    customRightArrow={<CustomRightArrow />}
                    dotListClass=""
                    draggable
                    focusOnSelect={false}
                    itemClass=""
                    keyBoardControl
                    minimumTouchDrag={80}
                    pauseOnHover
                    renderArrowsWhenDisabled={false}
                    renderButtonGroupOutside={true}
                    rewind={false}
                    rewindWithAnimation={false}
                    rtl={false}
                    shouldResetAutoplay
                    showDots={false}
                    sliderClass=""
                    slidesToSlide={1}
                    swipeable
                    responsive={responsive}
                >

                    {
                        products && products.map((product) => (
                            <ProductCard product={product} height="400px" width="90%" />
                        ))
                    }

                </Carousel>

            </div>
        </div>
    )
}

export default ProductsCarousel

