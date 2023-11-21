import React from 'react'
import { allFields } from '../../Data';

const EditProductForm = ({ product }) => {
    return (
        (product && Object.keys(product).length > 0) && (
            Object.keys(product).filter(field => Object.keys(allFields).includes(field)).map((field, index) => (
                <div key={index} className='input-section'>
                    <label className='label1' htmlFor={field}>{field.replace("_", " ")}</label>
                    <input
                        // onChange={formInputChangeHandler}
                        className="input1"
                        type="text"
                        name={field}
                        id={field}
                        onWheel={() => document.activeElement.blur()}
                        spellCheck={false}
                        value={product[field]}
                    />
                    {/* {(validateFields && !!numberValidator("Product stock", formData.stock, 5, 100000, Object.keys(commonFields).concat(variations).includes("stock"))) && (
                        <span className='input-error'>{numberValidator("Product stock", formData.stock, 5, 100000, Object.keys(commonFields).concat(variations).includes("stock"))}</span>
                    )} */}
                </div>
            ))
        )
    )
}

export default EditProductForm;
