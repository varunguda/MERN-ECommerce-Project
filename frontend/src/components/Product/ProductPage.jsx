import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from "../../State/action-creators";
import { useParams } from 'react-router';
import Metadata from '../Metadata';
import Loader from '../layouts/Loader/Loader';


const ProductPage = () => {

    // eslint-disable-next-line
    const { loading, products, error } = useSelector((state) => state.detailedProducts);

    const dispatch = useDispatch();

    const { getProductDetails } = bindActionCreators(actionCreators, dispatch);

    const id = useParams();

    useEffect(()=>{
        getProductDetails(id);
        // eslint-disable-next-line
    }, [])

  return (
    <>
        {
            loading ? <Loader /> : (
                <Metadata title={`${products[0].name.slice(0,20)}... - ManyIN`} />
            )
        }
    </>
  )
}

export default ProductPage
