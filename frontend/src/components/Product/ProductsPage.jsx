import React, { useEffect, useState } from 'react'
import DropdownButton from '../elements/Buttons/DropdownButton';
import Accordian from "../Product/Accordion.jsx";
import ProductCard from "../elements/Cards/ProductCard.jsx";
import Paginate from "../elements/Pagination/Paginate.jsx";

import "./ProductsPage.css";
import Metadata from '../Metadata';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators } from '../../State/action-creators';
import Loader from '../layouts/Loader/Loader';

const product = {
    "_id": "64ff92a23d2a29caa5098c98",
    "rating": 5,
    "total_reviews": 1,
    "product_id": "7a3adb42-669b-48fa-ba6b-a02b49c3e851",
    "name": "Samsung Galaxy S21",
    "description": "High-performance Android smartphone",
    "category": "Mobile Phone",
    "brand": "Samsung",
    "stock": 310,
    "price": 799.99,
    "final_price": 720,
    "discount_percent": 10,
    "images": []
}

const ProductsPage = ({ match }) => {

    const [ page, setPage ] = useState(1);

    const { loading, products, productCount } = useSelector((state) => state.products);

    const dispatch = useDispatch();
    const { getProducts } = bindActionCreators(actionCreators, dispatch);

    useEffect(() => {
        getProducts(page);
        // eslint-disable-next-line
    }, [dispatch, page]);

    const pageChangeHandler = (page) => {
        setPage(page);
    }

    return (
        <>
            {loading ? <Loader /> :
                (products && productCount >= 0) ? (
                    <>
                        <Metadata title={`${match.keyword ? match.keyword : "Products"} - ManyIN`}/>

                        <div className='products-page-container'>

                            <div className="products-page-header">
                                <div className="header-section">
                                    <DropdownButton style={{ backgroundColor: "#f1f1f2" }} name={"Price"} content={"hnn"} />
                                    <DropdownButton style={{ backgroundColor: "#f1f1f2" }} name={"Price"} content={"hnn"} />
                                    <DropdownButton style={{ backgroundColor: "#f1f1f2" }} name={"Price"} content={"hnn"} />
                                    <DropdownButton style={{ backgroundColor: "#f1f1f2" }} name={"Price"} content={"hnn"} />
                                </div>

                                <div className="header-section">
                                    <DropdownButton
                                        name={<><span style={{ fontWeight: "600" }}>Sort by </span>| &nbsp;Relevance</>}
                                        content={"hnn"} />
                                </div>
                            </div>


                            <div className="products-page-section">
                                <div className="products-page-sidebar">
                                    <Accordian title="Department" style={{ fontSize: "15px", fontWeight: "600" }} />
                                    <Accordian title="Price" style={{ fontSize: "15px", fontWeight: "600" }} />
                                    <Accordian title="Brand" style={{ fontSize: "15px", fontWeight: "600" }} />
                                    <Accordian title="Color" style={{ fontSize: "15px", fontWeight: "600" }} />
                                    <Accordian title="Availability" style={{ fontSize: "15px", fontWeight: "600" }} />
                                    <Accordian title="Customer Rating" style={{ fontSize: "15px", fontWeight: "600" }} />
                                </div>
                                <div className="products-page-content">
                                    <div className="products-grid">
                                        {
                                            [...Array(20)].map((elem, index) => {
                                                return (<ProductCard key={index} product={product} width="100%" height="380px" />);
                                            })
                                        }
                                    </div>

                                    <Paginate total={productCount} pageSize={20} current={page} onChange={pageChangeHandler} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                )
            }
        </>
    )
}

export default ProductsPage
