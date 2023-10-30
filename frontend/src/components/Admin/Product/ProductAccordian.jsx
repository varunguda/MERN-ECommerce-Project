import React, { useEffect, useState } from 'react';
import CreateProductForm from './CreateProductForm';
import Accordion from '../../elements/Accordians/Accordion';
import {RxCheckCircled, RxCrossCircled} from "react-icons/rx";


const ProductAccordian = ({ productCount, category, config, variations, setProducts, removeProduct, productAdded, setProductAdded }) => {

    const [resize, setResize] = useState(false);
    const [activateAccordion, setActivateAccordion] = useState(true);

    useEffect(() => {
        console.log({productAdded, productCount});
        if(productAdded){
            setActivateAccordion(false);
        }
        else{
            setActivateAccordion(true);
        }
    }, [productAdded])
    
    return (
        <Accordion
            title={<div className='title'>
                {`Product ${productCount}`}
                {(productAdded === true) ? (
                    <RxCheckCircled color='green' size={16} />
                ) : (
                    (productAdded === false) ? (
                        <RxCrossCircled color='red' size={16} />
                    ) : ""
                ) }
            </div>}

            content={
                <CreateProductForm 
                    category={category}
                    categoryConfig={config} 
                    setProductAdded={setProductAdded} 
                    setProducts={setProducts} 
                    setActivateAccordion={setActivateAccordion}
                    setResize={setResize} 
                    variations={variations}
                    productCount={productCount}
                    removeProduct={removeProduct}
                />
            }
            resize={resize}
            close={productAdded}
            activeProp={activateAccordion}
            setActiveProp={(val) => {
                setActivateAccordion(val);
            }}
        />
    )
}

export default ProductAccordian
