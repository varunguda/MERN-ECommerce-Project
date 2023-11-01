import React, { useState } from 'react';
import CreateProductForm from './CreateProductForm';
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";
import Accordion from '../../elements/Accordians/Accordion';


const ProductAccordian = ({ productCount, category, config, variations, setProducts, removeProduct, productState, setProductState }) => {

    const [resize, setResize] = useState(false);

    return (
        <Accordion
            title={
                <div className='title'>
                    {`Product ${productCount}`}
                    {(productState && (productState.added !== undefined) && productState.added === true) ? (
                        <RxCheckCircled color='green' size={16} />
                    ) : (
                        (productState && (productState.added !== undefined) && productState.added === false) ? (
                            <RxCrossCircled color='red' size={16} />
                        ) : ""
                    )}
                </div>
            }

            content={
                <CreateProductForm
                    category={category}
                    categoryConfig={config}
                    setProductState={setProductState}
                    setProducts={setProducts}
                    setResize={setResize}
                    variations={variations}
                    productCount={productCount}
                    removeProduct={removeProduct}
                    activeState={productState && (productState.active !== undefined) ? productState.active : true}
                    setActiveState={(val) => {
                        setProductState({ added: productState.added, active: val });
                    }}
                />
            }
            resize={resize}
            activeProp={productState && (productState.active !== undefined) ? productState.active : true}
            setActiveProp={(val) => {
                setProductState({ added: productState.added, active: val });
            }}
        />
    )
}

export default ProductAccordian
