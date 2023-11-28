import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../../elements/Cards/ProductCard";
import IconChevronRight from '@tabler/icons-react/dist/esm/icons/IconChevronRight';
import IconChevronLeft from '@tabler/icons-react/dist/esm/icons/IconChevronLeft';
import "./ProductCarousel.css"


const CustomLeftArrow = ({ onClick, ...rest }) => {
    return (
        <div {...rest} onClick={onClick} className='left-arrow'>
            <IconChevronLeft strokeWidth={1.75} size={30} />
        </div>
    );
};

const CustomRightArrow = ({ onClick, ...rest }) => {
    return (
        <div {...rest} onClick={onClick} className='right-arrow'>
            <IconChevronRight strokeWidth={1.75} size={30} />
        </div>
    );
};


const ProductsCarousel = ({ products, desktopItems, tabletItems, flipItems, mobileItems, heading, caption, noReviews = false }) => {

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: desktopItems || 6,
            slidesToSlide: 6
        },
        tablet: {
            breakpoint: { max: 1024, min: 720 },
            items: tabletItems || 4,
            slidesToSlide: 2
        },
        flip: {
            breakpoint: { max: 720, min: 0 },
            items: flipItems || 3,
            slidesToSlide: 1
        },
        mobile: {
            breakpoint: { max: 400, min: 0 },
            items: mobileItems || 2,
            slidesToSlide: 1
        }
    };

    return (
        <div className='product-carousel'>

            <div className="title">{heading}</div>
            <div className="caption">{caption}</div>

            <div className="carousel-container">
                {!!products &&
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
                        shouldResetAutoplay
                        showDots={false}
                        sliderClass=""
                        slidesToSlide={1}
                        swipeable
                        responsive={responsive}
                    >
                        {products.map((product, index) => (
                            <ProductCard key={index} height="400px" width="90%" product={product} noReviews={noReviews} />
                        ))}
                    </Carousel>
                }
            </div>
        </div>
    )
}

export default ProductsCarousel;

