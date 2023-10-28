import React, { Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactSlider from "react-slider";
import Accordian from "../elements/Accordians/Accordion";
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
import { MdOutlineShortText } from 'react-icons/md';
import { ramFormatter, ratingFormatter, removeDoublePipe, storageFormatter } from './utils';
import Stars from '../elements/Cards/Stars';
import FilterButton from '../elements/Buttons/FilterButton';
import SortComponent from './SortComponent';

const ProductsPage = () => {

    const { keyword, minPrice, maxPrice, page, category, brand, availability, facets, c_ratings, sort_by } = useSelector((state) => state.urlParams);

    const { loading, products, productCount, productsMaxPrice, productsMinPrice, productsExist, allCategories, productsBrands, productsFilters, productsRatings } = useSelector((state) => state.products);

    const dispatch = useDispatch();

    const { setKeyword, setMinPrice, setMaxPrice, setPage, setCategory, setBrand, setAvailability, setFacets, setRatings, setSort } = bindActionCreators(navigationActionCreators, dispatch);


    const location = useLocation();
    const navigate = useNavigate();


    const [price, setPrice] = useState([0, 100000]);
    const [sidebar, setSidebar] = useState(() => window.innerWidth < 1000 ? false : true);
    const [btnActive, setBtnActive] = useState(() => window.innerWidth < 1000 ? true : false);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [expandCategories, setExpandCategories] = useState(false);
    const [expandBrands, setExpandBrands] = useState(false);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedRam, setSelectedRam] = useState([]);
    const [selectedStorage, setSelectedStorage] = useState([]);
    const [selectedQuantity, setSelectedQuantity] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
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
        const queryFacets = queryParams.get("facets");
        const queryRatings = queryParams.get("c_ratings");
        const querySort = queryParams.get("sort_by")

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

        queryFacets ?
            setFacets(queryFacets) :
            setFacets("")

        queryRatings ?
            setRatings(queryRatings) :
            setRatings("");

        querySort ?
            setSort(querySort) :
            setSort("");



        setSidebar(() => window.innerWidth < 1000 ? false : true);
        window.scrollTo(0,0);


        // eslint-disable-next-line
    }, [location.search]);


    useEffect(() => {

        if (keyword) {
            const urlQuery = [
                category && `category=${encodeURIComponent(category)}`,
                brand && `brand=${encodeURIComponent(brand)}`,
                facets && `facets=${encodeURIComponent(facets)}`,
                c_ratings && `c_ratings=${encodeURIComponent(c_ratings)}`,
                availability && `availability=${encodeURIComponent(availability)}`,
                minPrice && `pricemin=${encodeURIComponent(minPrice)}`,
                maxPrice && `pricemax=${encodeURIComponent(maxPrice)}`,
                page && `page=${encodeURIComponent(page)}`,
                sort_by && `sort_by=${encodeURIComponent(sort_by)}`
            ].filter(Boolean).join('&');

            if (location.pathname + location.search !== `/search?keyword=${keyword}${urlQuery ? "&" + urlQuery : ""}`) {
                navigate(`?keyword=${keyword}${urlQuery ? "&" + urlQuery : ""}`, { replace: false });
            }
        }
        // eslint-disable-next-line
    }, [keyword, minPrice, maxPrice, page, category, brand, availability, facets, c_ratings, sort_by]);


    useEffect(() => {
        if (keyword) {
            getProducts();
        }
        // eslint-disable-next-line
    }, [keyword, minPrice, maxPrice, page, category, brand, availability, facets, c_ratings, sort_by]);


    useEffect(() => {
        if (brand && brand.split(",").length > 0 && selectedBrands.length !== brand.split(",").length) {
            setSelectedBrands(brand.split(","));
        }
        else if (brand === "") {
            setSelectedBrands([]);
        }
        // eslint-disable-next-line
    }, [brand]);


    useEffect(() => {
        if (selectedBrands.join(",") !== brand) {
            setBrand(selectedBrands.join(","));
        }
        // eslint-disable-next-line
    }, [selectedBrands]);


    useEffect(() => {

        if (category && category.split(",").length > 0 && selectedCategories.join(",") !== category) {
            setSelectedCategories(category.split(","));
        }
        else if (!category) {

            if (allCategories && (Object.keys(allCategories).length > 0)) {

                let productCategories = Object.keys(allCategories).filter(category => allCategories[category] > 0);

                let newSelectedCategories = selectedCategories.filter(category => productCategories.includes(category));

                productCategories.forEach(category => {
                    if (!newSelectedCategories.includes(category)) {
                        newSelectedCategories.push(category);
                    }
                });

                setSelectedCategories(newSelectedCategories);
            }
        }
        // eslint-disable-next-line
    }, [category, allCategories]);


    useEffect(() => {

        if (allCategories && (Object.keys(allCategories).length > 0) && selectedCategories.length > 0) {

            const checkCategory = () => {
                if (selectedCategories.join(",") === Object.keys(allCategories).filter((category) => allCategories[category] > 0).join(",")) {
                    return true;
                }
                return false;
            }

            if (!checkCategory()) {
                if (selectedCategories.join(",") !== category) {
                    setCategory(selectedCategories.join(","));
                }
            } else {
                setCategory("");
            }
        }

        // eslint-disable-next-line
    }, [selectedCategories]);


    useEffect(() => {

        if ((minPrice === productsMinPrice) && (maxPrice === productsMaxPrice)) {
            setMinPrice(0);
            setMaxPrice(0);
        }

        if (minPrice && maxPrice && (minPrice !== maxPrice)) {
            setPrice([minPrice, maxPrice]);
        }
        else if (productsMinPrice && productsMaxPrice) {
            if ((productsMinPrice !== productsMaxPrice) && (!price.every((val, index) => val === [productsMinPrice, productsMaxPrice][index]))) {
                setPrice([productsMinPrice, productsMaxPrice]);
            }
        }

        // eslint-disable-next-line
    }, [minPrice, maxPrice, productsMinPrice, productsMaxPrice]);


    useEffect(() => {

        if (facets && facets.split("||").length > 0 && productsFilters && Object.keys(productsFilters).length > 0) {

            let facetColors = [];
            let facetStorages = [];
            let facetRams = [];
            let facetQuantities = [];

            facets.split("||").forEach((part) => {
                const [key, val] = part.split(":");

                (key === "color") && facetColors.push(val);
                (key === "storage") && facetStorages.push(val);
                (key === "ram") && facetRams.push(val);
                (key === "quantity") && facetQuantities.push(val);

                console.log(key === "color" && Object.keys(productsFilters).includes("color") && !selectedColors.includes(val));
                if (key === "color" && Object.keys(productsFilters).includes("color") && !selectedColors.includes(val)) {
                    setSelectedColors(prev => [...prev].concat([val]));
                }
                else if (key === 'storage' && Object.keys(productsFilters).includes("storage") && !selectedStorage.includes(val)) {
                    setSelectedStorage(prev => [...prev].concat([val]));
                }
                else if (key === 'ram' && Object.keys(productsFilters).includes("ram") && !selectedRam.includes(val)) {
                    setSelectedRam(prev => [...prev].concat([val]));
                }
                else if (key === 'quantity' && Object.keys(productsFilters).includes("quantity") && !selectedQuantity.includes(val)) {
                    setSelectedQuantity(prev => [...prev].concat([val]));
                }
            });


            if (facetColors.length && facetColors.length < selectedColors.length) {
                setSelectedColors(prev => prev.filter((color) => facetColors.includes(color)))
            }
            if (facetStorages.length < selectedStorage.length) {
                setSelectedStorage(prev => prev.filter((storage) => facetStorages.includes(storage)))
            }
            if (facetRams.length < selectedRam.length) {
                setSelectedRam(prev => prev.filter((ram) => facetRams.includes(ram)))
            }
            if (facetQuantities.length < selectedQuantity.length) {
                setSelectedQuantity(prev => prev.filter((quantity) => facetQuantities.includes(quantity)))
            }

        }
        else if (facets === "" && productsFilters && Object.keys(productsFilters).length > 0) {
            setSelectedColors([]);
            setSelectedRam([]);
            setSelectedStorage([]);
            setSelectedQuantity([]);
        }

        // eslint-disable-next-line
    }, [facets, productsFilters]);


    const applyFilter = (selectedValues, filterKey, facets, setFacets) => {

        if (selectedValues && facets && facets !== "") {
            if (selectedValues.length > 0) {
                selectedValues.forEach((value) => {
                    const parts = facets.split("||");
                    let exist = false;

                    parts.forEach((elem) => {
                        const [key, val] = elem.split(":");
                        if (key === filterKey && value === val) {
                            exist = true;
                        }
                        if (key === filterKey && !selectedValues.includes(val)) {
                            let newFacets = facets.replace(`${filterKey}:${val}`, "");
                            setFacets(removeDoublePipe(newFacets));
                        }
                    });

                    if (!exist) {
                        let newFacets = facets + `||${filterKey}:${value}`;
                        setFacets(removeDoublePipe(newFacets));
                    }
                });
            } else {
                const parts = facets.split("||");

                parts.forEach((elem) => {
                    const [key, val] = elem.split(":");

                    if (key === filterKey) {
                        let newFacets = facets.replace(`${filterKey}:${val}`, "");
                        setFacets(removeDoublePipe(newFacets));
                    }
                });
            }
        } else if (facets === "" && selectedValues.length > 0) {
            setFacets(`${filterKey}:${selectedValues[0]}`);
        }
    };


    useEffect(() => {
        applyFilter(selectedColors, 'color', facets, setFacets);
        // eslint-disable-next-line
    }, [selectedColors]);

    useEffect(() => {
        applyFilter(selectedRam, 'ram', facets, setFacets);
        // eslint-disable-next-line
    }, [selectedRam]);

    useEffect(() => {
        applyFilter(selectedStorage, 'storage', facets, setFacets);
        // eslint-disable-next-line
    }, [selectedStorage]);

    useEffect(() => {
        applyFilter(selectedQuantity, 'quantity', facets, setFacets);
        // eslint-disable-next-line
    }, [selectedQuantity]);


    useEffect(() => {
        if (c_ratings && c_ratings.split(",").length > 0 && selectedRatings.length !== c_ratings.split(",").length) {
            setSelectedRatings(c_ratings.split(","));
        }
        else if (c_ratings === "") {
            setSelectedRatings([]);
        }
        // eslint-disable-next-line
    }, [c_ratings]);


    useEffect(() => {
        if (selectedRatings.join(",") !== c_ratings) {
            setRatings(selectedRatings.join(","));
        }
        // eslint-disable-next-line
    }, [selectedRatings]);


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

    const availabilityHandler = () => {
        if (availability === "oos") {
            setAvailability("")
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

    const handleCheckboxSelection = (value, setSelectedValues, allSelectedValues) => {

        const exist = allSelectedValues.includes(value);

        if (!exist) {
            setSelectedValues((prev) => [...prev, value]);
        } else {
            if (allSelectedValues === selectedCategories && selectedCategories.length === 1) {
                return;
            }
            else {
                setSelectedValues((prev) => prev.filter((val) => val !== value));
            }
        }

    };

    const brandsHandler = (e) => {
        handleCheckboxSelection(e.target.name, setSelectedBrands, selectedBrands);
    };

    const selectCategoryHandler = (e) => {
        handleCheckboxSelection(e.target.name, setSelectedCategories, selectedCategories);
    };

    const selectColorHandler = (e) => {
        handleCheckboxSelection(e.target.name, setSelectedColors, selectedColors);
    };

    const selectQuantityHandler = (e) => {
        handleCheckboxSelection(e.target.name, setSelectedQuantity, selectedQuantity);
    };

    const selectRamHandler = (e) => {
        handleCheckboxSelection(e.target.name, setSelectedRam, selectedRam);
    };

    const selectStorageHandler = (e) => {
        handleCheckboxSelection(e.target.name, setSelectedStorage, selectedStorage);
    };

    const ratingsClickHandler = (e) => {
        handleCheckboxSelection(e.target.name, setSelectedRatings, selectedRatings);
    }


    const removeFilter = (val, setSelectedValues, allSelectedValues) => {
        const newValues = allSelectedValues.filter((elem) => elem !== val);
        setSelectedValues(newValues);
    }


    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <Metadata title={`${keyword ? keyword.toUpperCase() : "Products"} - ManyIN`} />

                    {(productsExist && !loading) ? (

                        <div className='products-page-container'>

                            <div className="products-page-header">

                                <div className="header-section header1">

                                    <div className='filters-shortcuts'>

                                        {selectedCategories && selectedCategories.map((category, index) => {
                                            return (
                                                <FilterButton
                                                    key={index}
                                                    onClick={() => {
                                                        if (selectedCategories.length > 1) {
                                                            removeFilter(category, setSelectedCategories, selectedCategories)
                                                        }
                                                    }}
                                                    content={category}
                                                />
                                            )
                                        })}

                                        {((minPrice > 0) && (maxPrice > 0) && (minPrice !== productsMinPrice) && (maxPrice !== productsMaxPrice)) && (
                                            <FilterButton
                                                onClick={() => {
                                                    setMinPrice(0);
                                                    setMaxPrice(0);
                                                }}
                                                content={
                                                    <>
                                                        <span style={{ fontWeight: 600 }}>Price: </span>
                                                        {`₹${minPrice} - ₹${maxPrice}`}
                                                    </>
                                                }
                                            />
                                        )}

                                        {selectedBrands && selectedBrands.map((brand, index) => {
                                            return (
                                                <FilterButton
                                                    key={index}
                                                    onClick={() => removeFilter(brand, setSelectedBrands, selectedBrands)}
                                                    content={brand}
                                                />
                                            )
                                        })}

                                        {selectedColors && selectedColors.map((col, index) => {
                                            return (
                                                <FilterButton
                                                    key={index}
                                                    onClick={() => removeFilter(col, setSelectedColors, selectedColors)}
                                                    content={col}
                                                />
                                            )
                                        })}

                                        {selectedRam && selectedRam.map((ram, index) => {
                                            return (
                                                <FilterButton
                                                    key={index}
                                                    onClick={() => removeFilter(ram, setSelectedRam, selectedRam)}
                                                    content={ramFormatter(ram)}
                                                />
                                            )
                                        })}

                                        {selectedStorage && selectedStorage.map((storage, index) => {
                                            return (
                                                <FilterButton
                                                    key={index}
                                                    onClick={() => removeFilter(storage, setSelectedStorage, selectedStorage)}
                                                    content={storageFormatter(storage)}
                                                />
                                            )
                                        })}

                                        {selectedQuantity && selectedQuantity.map((quantity, index) => {
                                            return (
                                                <FilterButton
                                                    key={index}
                                                    onClick={() => removeFilter(quantity, setSelectedQuantity, selectedQuantity)}
                                                    content={quantity}
                                                />
                                            )
                                        })}

                                        {availability && availability === 'oos' &&
                                            <FilterButton
                                                onClick={availabilityHandler}
                                                content={"Out of stock"}
                                            />
                                        }

                                        {selectedRatings && selectedRatings.map((rating, index) => {
                                            return (
                                                <FilterButton
                                                    key={index}
                                                    onClick={() => removeFilter(rating, setSelectedRatings, selectedRatings)}
                                                    content={ratingFormatter(rating)}
                                                />
                                            )
                                        })}

                                    </div>

                                    <div className="clear-filters-btn" onClick={() => { navigate(`/search?keyword=${keyword}`) }}>
                                        Clear all
                                    </div>


                                </div>

                                <div className="header-section">

                                    <SortComponent sort_by={sort_by} />

                                    {btnActive && (
                                        <button ref={btnRef} className='primary-btn' onClick={moreClickHandler} >
                                            <MdOutlineShortText size={"20px"} color="#212121" />
                                            <span>More Filters</span>
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
                                                    {Object.keys(allCategories) && (Object.keys(allCategories).length > 0) && Object.keys(allCategories).slice(0, expandCategories ? Object.keys(allCategories).length : 5).map((category, index) => {
                                                        return (
                                                            <div key={index} className='checkboxes'>
                                                                <input onClick={selectCategoryHandler} checked={selectedCategories.includes(category)} type="checkbox" name={`${category}`} id={`${category}`} readOnly />
                                                                <label htmlFor={`${category}`}>
                                                                    <div className='sb-label'>
                                                                        {category}<span>{allCategories[category]}</span>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                    }

                                                    <button type='button' className='inferior-btn' onClick={toggleExpandCategories}>
                                                        {(!expandCategories && allCategories && Object.keys(allCategories).length > 5) ? "Show more" : "Show less"}
                                                    </button>
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
                                                        minDistance={10}
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

                                                    <button type='button' className='inferior-btn' onClick={toggleExpandBrands}>
                                                        {(productsBrands && productsBrands.length > 5) && (
                                                            (!expandBrands) ? "Show more" : "Show less"
                                                        )}
                                                    </button>

                                                </>
                                            }
                                        />


                                        {productsFilters && Object.keys(productsFilters).length > 0 && (
                                            Object.keys(productsFilters).map((filter, index) => (
                                                <Fragment key={index}>
                                                    <Accordian
                                                        title={filter}
                                                        style={{ fontSize: "15px", fontWeight: "600" }}
                                                        content={
                                                            <>
                                                                {
                                                                    (productsFilters[filter] && (Object.keys(productsFilters[filter]).length > 0) && Object.keys(productsFilters[filter]).map((type, index) => {

                                                                        return (
                                                                            <div key={index} className='checkboxes'>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name={type}
                                                                                    id={filter + type}
                                                                                    onClick={(e) => {
                                                                                        (filter === 'ram') ? selectRamHandler(e) :
                                                                                            (filter === 'storage') ? selectStorageHandler(e) :
                                                                                                (filter === 'quantity') ? selectQuantityHandler(e) :
                                                                                                    selectColorHandler(e);
                                                                                    }}
                                                                                    checked={
                                                                                        (filter === 'ram') ? selectedRam.includes(type) :
                                                                                            (filter === 'storage') ? selectedStorage.includes(type) :
                                                                                                (filter === 'quantity') ? selectedQuantity.includes(type) :
                                                                                                    selectedColors.includes(type)
                                                                                    }
                                                                                    readOnly
                                                                                />

                                                                                <label htmlFor={filter + type}>
                                                                                    <div className='sb-label'>
                                                                                        {
                                                                                            (filter === 'ram') ? ramFormatter(type) :
                                                                                                (filter === 'storage') ? storageFormatter(type) :
                                                                                                    (filter === 'quantity') ? "" :
                                                                                                        type
                                                                                        }
                                                                                        <span>
                                                                                            {productsFilters[filter][type]}
                                                                                        </span>
                                                                                    </div>
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    }))
                                                                }
                                                            </>
                                                        }
                                                    />
                                                </Fragment>
                                            ))
                                        )}



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
                                            content={
                                                (productsRatings && (Object.keys(productsRatings).length > 0) && Object.keys(productsRatings).map((rating, index) => {
                                                    return (

                                                        <div key={index} className='checkboxes'>
                                                            <input onClick={ratingsClickHandler} checked={selectedRatings.includes(rating)} type="checkbox" name={rating} id={`rating${rating}`} readOnly />

                                                            <label htmlFor={`rating${rating}`}>
                                                                <div className='sb-label'>
                                                                    <div>
                                                                        <Stars value={rating} size={11} /> & up
                                                                    </div>
                                                                    <span>
                                                                        {productsRatings[rating]}
                                                                    </span>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    )
                                                }))

                                            }
                                        />
                                    </div>
                                )}

                                <div className={`products-page-content ${btnActive ? "fill" : ""}`}>
                                    {(productCount > 0 && products.length > 0) ? (
                                        <>
                                            <div className="products-grid">
                                                {
                                                    products.map((product, index) => {
                                                        return (<ProductCard key={index} product={product} width="100%" height="380px" />);
                                                    })
                                                }
                                            </div>

                                            {productCount > 10 && (
                                                <Paginate total={productCount} pageSize={10} current={page ? Number(page) : 1} onChange={pageChangeHandler} />
                                            )}
                                        </>
                                    ) : (
                                        <div className='products-page-banner'>
                                            <div>
                                                No Products within these filters are available!
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