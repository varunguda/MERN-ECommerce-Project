import React, { useEffect, useState } from 'react';
import "./Product.css";
import Table from '../../elements/Table/Table';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../State/action-creators/ProductActionCreators';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { setAvailability, setPage } from '../../../State/action-creators/NavigationActionCreators';


const AllProducts = () => {

    const { loading, products, productCount } = useSelector(state => state.products);

    const [ pageNum, setPageNum ] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPage(pageNum));
        dispatch(setAvailability("oos"));
        dispatch(getProducts());

        // eslint-disable-next-line 
    }, [pageNum]);


    useEffect(() => {
        if(loading){
            dispatch(loaderSpin(true));
        }
        else{
            dispatch(loaderSpin(false));
        }

        // eslint-disable-next-line
    }, [loading]);


    return (
        <div className="profile-page-content">
            <div className="page-head">Products</div>
            {(loading === false) && (
                <div className='all-products-container'>
                    <Table products={products} page={pageNum} getPage={setPageNum} productCount={productCount} />
                </div>
            )}
        </div>
    )
}

export default AllProducts
