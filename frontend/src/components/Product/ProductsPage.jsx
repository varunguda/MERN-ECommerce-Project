import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactSlider from "react-slider";
import DropdownButton from '../elements/Buttons/DropdownButton';
import Accordian from "../Product/Accordion.jsx";
import ProductCard from "../elements/Cards/ProductCard.jsx";
import Paginate from "../elements/Pagination/Paginate.jsx";
import { useLocation, useNavigate } from 'react-router';

import "./ProductsPage.css";
import Metadata from '../Metadata';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators, navigationActionCreators } from '../../State/action-creators';
import Loader from '../layouts/Loader/Loader';
import { Link } from 'react-router-dom';
import { FiMoreHorizontal } from 'react-icons/fi';

const ProductsPage = () => {

    const { keyword, minPrice, maxPrice, page, category, brand, availability } = useSelector((state) => state.urlParams);

    const { loading, products, productCount, productsMaxPrice, productsMinPrice, productsExist, allCategories, productsBrands } = useSelector((state) => state.products);

    const dispatch = useDispatch();

    const { setKeyword, setMinPrice, setMaxPrice, setPage, setCategory, setBrand, setAvailability } = bindActionCreators(navigationActionCreators, dispatch);


    const location = useLocation();
    const navigate = useNavigate();


    const [price, setPrice] = useState([0, 100000]);
    const [sidebar, setSidebar] = useState(() => window.innerWidth < 1000 ? false : true);
    const [btnActive, setBtnActive] = useState(() => window.innerWidth < 1000 ? true : false);
    // eslint-disable-next-line
    const [selectedBrands, setAllSelectedBrands] = useState([]);
    const [expandCategories, setExpandCategories] = useState(false);
    const [expandBrands, setExpandBrands] = useState(false);
    const sidebarRef = useRef(null);
    const btnRef = useRef(null);


    const { getProducts } = bindActionCreators(actionCreators, dispatch);


    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);

        const queryKeyword = queryParams.get('keyword');
        const queryPage = queryParams.get('page');
        const queryMinPrice = queryParams.get('pricemin');
        const queryMaxPrice = queryParams.get('pricemax');
        const queryCategory = queryParams.get('category');
        const queryAvailability = queryParams.get('availability');
        const queryBrand = queryParams.get('brand');

        queryKeyword ?
            setKeyword(queryKeyword) :
            setKeyword("")

        queryMinPrice ?
            setMinPrice(queryMinPrice) :
            setMinPrice(0)

        queryMaxPrice ?
            setMaxPrice(queryMaxPrice) :
            setMaxPrice(0)

        queryCategory ?
            setCategory(queryCategory) :
            setCategory("")

        queryPage ?
            setPage(queryPage) :
            setPage(0)

        queryBrand ?
            setBrand(queryBrand) :
            setBrand("")
            
        queryAvailability ?
            setAvailability(queryAvailability) :
            setAvailability("")


        // eslint-disable-next-line
    }, [location.search]);


    useEffect(() => {

        if (keyword) {
            const urlQuery = [
                minPrice && `pricemin=${encodeURIComponent(minPrice)}`,
                maxPrice && `pricemax=${encodeURIComponent(maxPrice)}`,
                category && `category=${encodeURIComponent(category)}`,
                availability && `availability=${encodeURIComponent(availability)}`,
                brand && `brand=${encodeURIComponent(brand)}`,
                page && `page=${encodeURIComponent(page)}`
            ].filter(Boolean).join('&');

            if (location.pathname + location.search !== `/${keyword}?keyword=${keyword}${urlQuery ? "&" + urlQuery : ""}`) {
                navigate(`?keyword=${keyword}${urlQuery ? "&" + urlQuery : ""}`, { replace: false });
            }
        }
        // eslint-disable-next-line
    }, [keyword, minPrice, maxPrice, page, category, brand, availability]);
    
    
    useEffect(() => {
        if (keyword) {
            console.log("fetching...");
            getProducts(keyword, minPrice, maxPrice, page, category, brand, availability);
        }
        // eslint-disable-next-line
    }, [keyword, minPrice, maxPrice, page, category, brand, availability]);


    useEffect(()=>{
        console.log(minPrice);
    }, [minPrice])


    useEffect(() => {
        const hideSidebar = () => {
            if (window.innerWidth < 1000) {
                setSidebar(false);
                setBtnActive(true);
            }
            else {
                setSidebar(true);
                setBtnActive(false);
            }
        }

        window.addEventListener("resize", hideSidebar);

        return () => {
            window.removeEventListener("resize", hideSidebar);
        }
        // eslint-disable-next-line
    }, []);


    useEffect(() => {

        const handleSidebarOutClick = (e) => {
            if (btnActive && sidebarRef.current && btnRef.current) {
                if (!sidebarRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
                    setSidebar(false);
                }
            }
        }

        window.addEventListener("click", handleSidebarOutClick);

        return () => {
            window.removeEventListener('click', handleSidebarOutClick)
        }
        // eslint-disable-next-line
    }, [])


    useEffect(() => {

        if (minPrice && maxPrice) {
            setPrice([minPrice, maxPrice]);
        }
        else {
            if (productsMinPrice && productsMaxPrice) {
                if ((productsMinPrice !== productsMaxPrice) && (!price.every((val, index) => val === [productsMinPrice, productsMaxPrice][index]))) {
                    setPrice([productsMinPrice, productsMaxPrice]);
                }
            }
        }

        // eslint-disable-next-line
    }, [productsMinPrice, productsMaxPrice, minPrice, maxPrice]);


    useEffect(()=>{
        setBrand(selectedBrands.join(","));
    // eslint-disable-next-line
    }, [selectedBrands])

    const pageChangeHandler = (page) => {
        setPage(page);
    }

    const priceAfterChangeHandler = (newPriceRange) => {
        setPrice([newPriceRange[0], newPriceRange[1]]);
        setMinPrice(newPriceRange[0]);
        setMaxPrice(newPriceRange[1]);
    }

    const moreClickHandler = () => {
        setSidebar(prev => !prev);
    }

    const brandsHandler = (e) => {
        let exist = false;
        selectedBrands.forEach((brand) => {
            if(brand === e.target.name){
                exist = true;
            }
        })
        if(!exist){
            setAllSelectedBrands((prev) => [...prev].concat([e.target.name]));
        }
        else{
            setAllSelectedBrands((prev) => prev.filter((brand) => brand !== e.target.name));
        }
    }

    const availabilityHandler = () => {
        if (availability === "oos") {
            setAvailability(undefined)
        }
        else {
            setAvailability("oos")
        }
    }

    const toggleExpandCategories = () => {
        setExpandCategories(prev => !prev);
    }

    const toggleExpandBrands = () => {
        setExpandBrands(prev => !prev);
    }


    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <Metadata title={`${keyword ? keyword.toUpperCase() : "Products"} - ManyIN`} />
                    {(productsMaxPrice > 0 && productsExist) ? (

                        <div className='products-page-container'>

                            <div className="products-page-header">

                                <div className="header-section header1">

                                    <DropdownButton
                                        style={{ backgroundColor: "#f1f1f2" }}
                                        name={"Price"}
                                        content={"hnn"}
                                    />

                                </div>

                                <div className="header-section">
                                    <DropdownButton
                                        name={<><span style={{ fontWeight: "600" }}>Sort by </span>| &nbsp;Relevance</>}
                                        content={"hnn"}
                                    />

                                    {btnActive && (
                                        <button ref={btnRef} className='primary-btn' onClick={moreClickHandler} >
                                            <FiMoreHorizontal size={"20px"} color="#212121" />
                                            More Filters
                                        </button>
                                    )}
                                </div>
                            </div>


                            <div className="products-page-section">

                                {sidebar && (
                                    <div ref={sidebarRef} className={`products-page-sidebar ${btnActive ? "active" : ""}`}>

                                        <Accordian
                                            title="Department"
                                            style={{ fontSize: "15px", fontWeight: "600" }}
                                            content={
                                                <>
                                                    {allCategories && (allCategories.length > 0) && allCategories.slice(0, expandCategories ? allCategories.length : 5).map((category, index) => {
                                                        return (
                                                            <div key={index} className='checkboxes'>
                                                                <input onClick={availabilityHandler} type="checkbox" name={`${category}`} id={`${category}`} readOnly />
                                                                <label htmlFor={`${category}`}>{category}</label>
                                                            </div>
                                                        )
                                                    })
                                                    }

                                                    <div className='secondary-btn' onClick={toggleExpandCategories}>
                                                        {(allCategories && allCategories.length > 5 && !expandCategories) ? "Show more" : "Show less"}
                                                    </div>
                                                </>
                                            }
                                        />

                                        {(productsMinPrice !== productsMaxPrice) && (price[0] >= productsMinPrice && price[1] <= productsMaxPrice) && (
                                            <Accordian
                                                title="Price"
                                                style={{ fontSize: "15px", fontWeight: "600" }}
                                                content={
                                                    <StyledSlider
                                                        defaultValue={price}
                                                        renderTrack={Track}
                                                        renderThumb={Thumb}
                                                        min={productsMinPrice}
                                                        max={productsMaxPrice}
                                                        minDistance={0}
                                                        onAfterChange={priceAfterChangeHandler}
                                                    />
                                                }
                                            />
                                        )}

                                        <Accordian
                                            title="Brand"
                                            style={{ fontSize: "15px", fontWeight: "600" }}
                                            content={
                                                <>
                                                    {
                                                        (productsBrands && (productsBrands.length > 0) && productsBrands.slice(0, expandBrands ? expandBrands.length : 5).map((brand, index) => {
                                                            return (
                                                                <div key={index} className='checkboxes'>
                                                                    <input onClick={brandsHandler} checked={selectedBrands.includes(brand)} type="checkbox" name={`${brand}`} id={`${brand}`} readOnly />
                                                                    <label htmlFor={`${brand}`}>{brand}</label>
                                                                </div>
                                                            )
                                                        }))
                                                    }

                                                    <div className='secondary-btn' onClick={toggleExpandBrands}>
                                                        {(productsBrands && productsBrands.length > 5) && (
                                                            (!expandBrands) ? "Show more" : "Show less"
                                                        )}
                                                    </div>

                                                </>
                                            }
                                        />

                                        <Accordian
                                            title="Color"
                                            style={{ fontSize: "15px", fontWeight: "600" }}
                                        />

                                        <Accordian
                                            title="Availability"
                                            style={{ fontSize: "15px", fontWeight: "600" }}
                                            content={
                                                <div className='checkboxes'>
                                                    <input onClick={availabilityHandler} checked={availability === "oos"} type="checkbox" name="availabilty" id="availability" readOnly />
                                                    <label htmlFor='availability'>Include Out of Stock</label>
                                                </div>
                                            }
                                        />

                                        <Accordian
                                            title="Customer Rating"
                                            style={{ fontSize: "15px", fontWeight: "600" }}
                                        />
                                    </div>
                                )}

                                <div className={`products-page-content ${btnActive ? "fill" : ""}`}>
                                    {(productCount > 0) ? (
                                        <>
                                            <div className="products-grid">
                                                {
                                                    products.map((product, index) => {
                                                        return (<ProductCard key={index} product={product} width="100%" height="380px" />);
                                                    })
                                                }
                                            </div>

                                            {productCount > 20 && (
                                                <Paginate total={productCount} pageSize={20} current={page} onChange={pageChangeHandler} />
                                            )}
                                        </>
                                    ) : (
                                        <div className='products-page-banner'>
                                            <div>
                                                No Products available within these filters are available!
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    ) : (
                        <>
                            <div className='products-page-banner'>
                                <div>
                                    Your search <span style={{ fontWeight: "600" }}>{`"${keyword}"`}</span> didn't match any results. Look at
                                    <Link className='link' to="/"> other items in our store</Link>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default ProductsPage;


const StyledSlider = styled(ReactSlider)`;
    width: 100%;
    height: 4px;
    margin-bottom: 20px;
`;

const StyledThumb = styled.div`
    height: 15px;
    position: absolute;
    color: black;
    line-height: 42px;
    top: -5px;
    width: 15px;
    background-color: white;
    border: 3px solid #0055a5;
    border-radius: 50%;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #4CAF50;
    }

    &:hover {
        border-color: #ffc220;
    }
`;

const Thumb = (props, state) => <StyledThumb {...props}>{state.valueNow}</StyledThumb>;

const StyledTrack = styled.div`
    top: 0;
    bottom: 0;
    background: #bad3eb;
    border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;