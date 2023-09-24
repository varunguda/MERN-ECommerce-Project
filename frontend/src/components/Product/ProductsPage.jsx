import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactSlider from "react-slider";
import DropdownButton from '../elements/Buttons/DropdownButton';
import Accordian from "../Product/Accordion.jsx";
import ProductCard from "../elements/Cards/ProductCard.jsx";
import Paginate from "../elements/Pagination/Paginate.jsx";
import { useLocation } from 'react-router';

import "./ProductsPage.css";
import Metadata from '../Metadata';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators, navigationActionCreators } from '../../State/action-creators';
import Loader from '../layouts/Loader/Loader';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { FiMoreHorizontal } from 'react-icons/fi';

const ProductsPage = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    const keyword = queryParams.get('keyword') || "";
    const page = queryParams.get('page') || "";
    const minPrice = queryParams.get('pricemin') || "";
    const maxPrice = queryParams.get('pricemax') || "";
    const category = queryParams.get('category') || "";
    const availability = queryParams.get('availability') || "";
    const brand = queryParams.get('brand') || "";
    
    
    const dispatch = useDispatch();

    const { setKeyword, setMinPrice, setMaxPrice, setPage, setCategory, setBrand, setAvailability } = bindActionCreators( navigationActionCreators, dispatch );


    const [price, setPrice] = useState([0, 10000]);
    const [priceMax, setPriceMax] = useState(0);
    const [sidebar, setSidebar] = useState(() => window.innerWidth < 1000 ? false : true);
    const [btnActive, setBtnActive] = useState(() => window.innerWidth < 1000 ? true : false);
    const [allBrands, setAllBrands] = useState([]);
    const [brandsSelected, setAllSelectedBrands] = useState([]);
    const sidebarRef = useRef(null);
    const btnRef = useRef(null);

    const { loading, products, productCount, productsMaxPrice, productsExist, allCategories, productsBrands } = useSelector((state) => state.products);

    const { getProducts } = bindActionCreators(actionCreators, dispatch);


    useEffect(()=>{
        setKeyword(keyword);
    }, [keyword])

    useEffect(()=>{
        setMinPrice(minPrice);
    }, [minPrice])

    useEffect(()=>{
        setMaxPrice(maxPrice);
    }, [maxPrice])

    useEffect(()=>{
        setCategory(category);
    }, [category])
    
    useEffect(()=>{
        setBrand(brand);
    }, [brand])

    useEffect(()=>{
        setPage(page);
    }, [page])

    useEffect(()=>{
        setAvailability(availability);
    }, [availability])


    useEffect(() => {
        getProducts();
        // eslint-disable-next-line
    }, [dispatch, keyword, minPrice, maxPrice, page, category, brand, availability]);


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
        if(price.every((val, index) => val !== [0, productsMaxPrice][index])){
            setPrice([0, productsMaxPrice]);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(()=>{
        setPrice([minPrice, maxPrice]);
    }, [minPrice, maxPrice])


    useEffect(() => {
        if (productsMaxPrice && (productsMaxPrice > 0) && (priceMax === 0)) {
            setPriceMax(productsMaxPrice);
        }
        // eslint-disable-next-line
    }, [productsMaxPrice])


    useEffect(() => {
        if (productsBrands && (productsBrands.length > 0) && (allBrands.length === 0)) {
            setAllBrands(productsBrands);
        }
        // eslint-disable-next-line
    }, [productsBrands]);


    useEffect(() => {
        if (productsBrands && productsBrands.length > 0) {
            setAllSelectedBrands(productsBrands);
        }
    }, [productsBrands])


    const pageChangeHandler = (page) => {
        setPage(page);
    }

    const priceAfterChangeHandler = (newPriceRange) => {
        setMinPrice(newPriceRange[0]);
        setMaxPrice(newPriceRange[1]);
    }

    const moreClickHandler = () => {
        setSidebar(prev => !prev);
    }

    const brandsHandler = (e) => {
        setAllSelectedBrands(prev => prev.map((brand) => {
            if (brand !== e.target.name) {
                return brand;
            }
        }))
    }

    const availabilityHandler = () => {
        if(availability === "oos"){
            setAvailability(undefined)
        }
        else{
            setAvailability("oos")
        }
    }

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <Metadata title={`${keyword ? keyword.toUpperCase() : "Products"} - ManyIN`} />
                    {(priceMax > 0 && productsExist) ? (

                        <div className='products-page-container'>

                            <div className="products-page-header">
                                <div className="header-section header1">
                                    <DropdownButton
                                        style={{ backgroundColor: "#f1f1f2" }}
                                        name={"Price"}
                                        content={"hnn"}
                                    />

                                    <DropdownButton
                                        style={{ backgroundColor: "#f1f1f2" }}
                                        name={"Price"}
                                        content={"hnn"}
                                    />
                                    <DropdownButton
                                        style={{ backgroundColor: "#f1f1f2" }}
                                        name={"Price"}
                                        content={"hnn"}
                                    />

                                    <DropdownButton
                                        style={{
                                            width: "260px",
                                            padding: "40px 20px 30px 20px"
                                        }}
                                        name={"Price"}
                                        content={
                                            <>
                                                <StyledSlider
                                                    defaultValue={price}
                                                    renderTrack={Track}
                                                    renderThumb={Thumb}
                                                    min={0}
                                                    max={priceMax}
                                                    minDistance={10}
                                                    onAfterChange={priceAfterChangeHandler}
                                                />
                                            </>
                                        }
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
                                                (allCategories && (allCategories.length>0) && allCategories.map((category, index) => {
                                                    return (
                                                        <div key={index} className='checkboxes'>
                                                            <input onClick={availabilityHandler} type="checkbox" name={`${category}`} id={`${category}`} readOnly/>
                                                            <label htmlFor={`${category}`}>{category}</label>
                                                        </div>
                                                    )
                                                }))
                                            }
                                        />

                                        <Accordian
                                            title="Price"
                                            style={{ fontSize: "15px", fontWeight: "600" }}
                                            content={
                                                <>
                                                    <StyledSlider
                                                        defaultValue={price}
                                                        renderTrack={Track}
                                                        renderThumb={Thumb}
                                                        min={0}
                                                        max={priceMax}
                                                        minDistance={10}
                                                        onAfterChange={priceAfterChangeHandler}
                                                    />
                                                </>
                                            }
                                        />

                                        <Accordian
                                            title="Brand"
                                            style={{ fontSize: "15px", fontWeight: "600" }}
                                            content={
                                                (allBrands && (allBrands.length>0) && allBrands.map((brand, index) => {
                                                    return (
                                                        <div key={index} className='checkboxes'>
                                                            <input onClick={brandsHandler} checked={productsBrands.includes(brand)} type="checkbox" name={`${brand}`} id={`${brand}`} readOnly/>
                                                            <label htmlFor={`${brand}`}>{brand}</label>
                                                        </div>
                                                    )
                                                }))
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
                                                    <input onClick={availabilityHandler} checked={availability==="oos"} type="checkbox" name="availabilty" id="availability" readOnly/>
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

                                            <Paginate total={productCount} pageSize={20} current={page} onChange={pageChangeHandler} />
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
    direction: rtl;

    &:focus {
        outline: none;
        border-color: #4CAF50;
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