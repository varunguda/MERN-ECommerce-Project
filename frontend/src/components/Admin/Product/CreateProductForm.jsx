import React, { useContext, useEffect, useRef, useState } from 'react'
import { numberValidator, stringValidator } from './utils';
import { ModalContext } from '../../../Context/ModalContext';

const commonFields = {
    name: "",
    description: "",
    // images: "",
    price: "",
    discount_percent: "",
    stock: "",
}

const CreateProductForm = ({ category, categoryConfig, setResize, variations, setProducts, productCount, removeProduct, setProductState, activeState, setActiveState }) => {

    const { openModal, closeModal } = useContext(ModalContext);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        // images: "",
        price: "",
        discount_percent: "",
        stock: "",
        color: "",
        size: "",
        storage: "",
        ram: "",
        quantity: "",
        processor: "",
    });
    const [validateFields, setValidateFields] = useState(false);
    const errorRef = useRef(null);

    useEffect(() => {
        if (Object.keys(categoryConfig).includes(category)) {
            const obj = {};
            categoryConfig[category].properties.map(prop => obj[prop] = "");
            setFormData({ ...commonFields, ...obj });
        }
        // eslint-disable-next-line
    }, [category]);


    const isFormDatavalid = () => {
        const validators = [
            (formData.name !== undefined) ? !!stringValidator("Product name", formData.name, 10, 250, Object.keys(commonFields).concat(variations).includes("name")) : false,

            (formData.description !== undefined) ? !!stringValidator("Product description", formData.description, 10, 1000, Object.keys(commonFields).concat(variations).includes("description")) : false,

            (formData.price !== undefined) ? !!numberValidator("Product price", formData.price, 10, 999999, Object.keys(commonFields).concat(variations).includes("price")) : false,

            (formData.discount_percent !== undefined) ? !!numberValidator("Product discount percentage", formData.discount_percent, 0, 90, false) : false,

            (formData.stock !== undefined) ? !!numberValidator("Product stock", formData.stock, 5, 100000, Object.keys(commonFields).concat(variations).includes("stock")) : false,

            (formData.color !== undefined) ? !!stringValidator("Color", formData.color, 2, 40, Object.keys(commonFields).concat(variations).includes("color")) : false,

            (formData.ram !== undefined) ? !!numberValidator("Ram", formData.ram, 1, 10000, Object.keys(commonFields).concat(variations).includes("ram")) : false,

            (formData.storage !== undefined) ? !!numberValidator("Storage", formData.storage, 1, 10000, Object.keys(commonFields).concat(variations).includes("storage")) : false,

            (formData.processor !== undefined) ? !!stringValidator("Processor", formData.processor, 5, 100, Object.keys(commonFields).concat(variations).includes("processor")) : false,

            (formData.size !== undefined) ? !!stringValidator("Size", formData.size, 2, 10, Object.keys(commonFields).concat(variations).includes("size")) : false,

            (formData.quantity !== undefined) ? !!numberValidator("Quantity", formData.quantity, 1, 10000, Object.keys(commonFields).concat(variations).includes("quantity")) : false
        ];

        return validators.every(validator => !validator);
    }


    const formInputChangeHandler = (e) => {
        const maxLength = {
            name: 250,
            description: 1000,
            // images: "",
            price: 7,
            discount_percent: 2,
            stock: 5,
            color: 40,
            ram: 4,
            storage: 5,
            processor: 100,
            size: 10,
            quantity: 5
        };

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value.slice(0, maxLength[e.target.name] ? maxLength[e.target.name] : e.target.value.length)
        }));
    }


    const removeClickHandler = () => {

        const modalContent = (
            <>
                <div className="modal-caption">This action is permanet and cannot be undone.</div>
                <div className="modal-btn-container">
                    <button onClick={closeModal} className='secondary-btn' type="button">No</button>
                    <button
                        onClick={() => {
                            removeProduct(productCount);
                            closeModal();
                        }}
                        className='main-btn'
                        type="button"
                    >
                        Yes
                    </button>
                </div>
            </>
        )

        openModal("Are you sure you want to remove this product?", modalContent);
    }


    const onSubmit = (e) => {
        e.preventDefault();

        setValidateFields(true);
        setResize(true);

        if (isFormDatavalid()) {
            setProducts(prev => {
                if (!prev[productCount - 1]) {
                    return prev.concat([formData]);
                }

                return prev.map((elem, index) => {
                    if (index === productCount - 1) {
                        return formData;
                    }
                    return elem;
                })
            });

            setActiveState(false);
            setProductState({ added: true, active: false });
        } else {
            setProductState({ added: false, active: true });
        }
    }


    return (
        <>
            {(Object.keys(categoryConfig).includes(category) && categoryConfig[category].properties.every(prop => Object.keys(formData).includes(prop))) && (

                <form onSubmit={onSubmit} method="post">

                    <div className="form-instruction" style={{ marginBottom: "8px" }}>*Required fields</div>

                    <div ref={errorRef} className="error-alert" style={{ marginBottom: "10px", display: "none" }}>
                        Please verify all fields below.
                    </div>

                    <div className='input-section'>
                        <label className='label1' htmlFor="name">{`Name${Object.keys(commonFields).concat(variations).includes("name") ? "*" : ""}`}</label>
                        <input
                            onChange={formInputChangeHandler}
                            className={
                                `${(validateFields && !!stringValidator("Product name", formData.name, 10, 250, Object.keys(commonFields).concat(variations).includes("name"))) ? "invalid" : ""}  input1`
                            }
                            type="text"
                            name="name"
                            id="name"
                            spellCheck={false}
                            value={formData.name}
                        />
                        {(validateFields && !!stringValidator("Product name", formData.name, 10, 250, Object.keys(commonFields).concat(variations).includes("name"))) && (
                            <span className='input-error'>{stringValidator("Product name", formData.name, 10, 250, Object.keys(commonFields).concat(variations).includes("name"))}</span>
                        )}
                    </div>


                    <div className='input-section'>
                        <label className='label1' htmlFor="description">{`Description${Object.keys(commonFields).concat(variations).includes("description") ? "*" : ""}`}</label>
                        <textarea
                            onChange={formInputChangeHandler}
                            className={`${(validateFields && !!stringValidator("Product description", formData.description, 10, 1000, Object.keys(commonFields).concat(variations).includes("description"))) ? "invalid" : ""}  textarea1`}
                            name="description"
                            id="description"
                            spellCheck={false}
                            value={formData.description}
                        />
                        {(validateFields && !!stringValidator("Product description", formData.description, 10, 1000, Object.keys(commonFields).concat(variations).includes("description"))) && (
                            <span className='input-error'>{stringValidator("Product description", formData.description, 10, 1000, Object.keys(commonFields).concat(variations).includes("description"))}</span>
                        )}
                    </div>


                    <div className='input-section'>
                        <label className='label1' htmlFor="price">{`Price${Object.keys(commonFields).concat(variations).includes("price") ? "*" : ""}`}</label>
                        <input
                            onChange={formInputChangeHandler}
                            className={`${(validateFields && !!numberValidator("Product price", formData.price, 10, 999999, Object.keys(commonFields).concat(variations).includes("price"))) ? "invalid" : ""}  input1`}
                            type="number"
                            name="price"
                            id="price"
                            onWheel={() => document.activeElement.blur()}
                            spellCheck={false}
                            value={formData.price}
                        />
                        {(validateFields && !!numberValidator("Product price", formData.price, 10, 999999, Object.keys(commonFields).concat(variations).includes("price"))) && (
                            <span className='input-error'>{numberValidator("Product price", formData.price, 10, 999999, Object.keys(commonFields).concat(variations).includes("price"))}</span>
                        )}
                    </div>


                    <div className='input-section'>
                        <label className='label1' htmlFor="discount_percent">{`Discount Percent`}</label>
                        <input
                            onChange={formInputChangeHandler}
                            className={`${(validateFields && !!numberValidator("Product discount percentage", formData.discount_percent, 0, 90, false)) ? "invalid" : ""}  input1`}
                            type="number"
                            name="discount_percent"
                            id="discount_percent"
                            onWheel={() => document.activeElement.blur()}
                            spellCheck={false}
                            value={formData.discount_percent}
                        />
                        {(validateFields && !!numberValidator("Product discount percentage", formData.discount_percent, 0, 90, false)) && (
                            <span className='input-error'>{numberValidator("Product discount percentage", formData.discount_percent, 0, 90, false)}</span>
                        )}
                    </div>


                    <div className='input-section'>
                        <label className='label1' htmlFor="stock">{`Stock${Object.keys(commonFields).concat(variations).includes("stock") ? "*" : ""}`}</label>
                        <input
                            onChange={formInputChangeHandler}
                            className={`${(validateFields && !!numberValidator("Product stock", formData.stock, 5, 100000, Object.keys(commonFields).concat(variations).includes("stock"))) ? "invalid" : ""}  input1`}
                            type="number"
                            name="stock"
                            id="stock"
                            onWheel={() => document.activeElement.blur()}
                            spellCheck={false}
                            value={formData.stock}
                        />
                        {(validateFields && !!numberValidator("Product stock", formData.stock, 5, 100000, Object.keys(commonFields).concat(variations).includes("stock"))) && (
                            <span className='input-error'>{numberValidator("Product stock", formData.stock, 5, 100000, Object.keys(commonFields).concat(variations).includes("stock"))}</span>
                        )}
                    </div>


                    {categoryConfig[category].properties.includes("color") && (
                        <div className='input-section'>
                            <label className='label1' htmlFor="color">{`Color${Object.keys(commonFields).concat(variations).includes("color") ? "*" : ""}`}</label>
                            <input
                                type='text'
                                className={`${(validateFields && !!stringValidator("Color", formData.color, 2, 40, Object.keys(commonFields).concat(variations).includes("color"))) ? "invalid" : ""}  input1`}
                                name="color"
                                id='color'
                                onChange={formInputChangeHandler}
                                spellCheck={false}
                                value={formData.color}
                            />
                            {(validateFields && !!stringValidator("Color", formData.color, 2, 40, Object.keys(commonFields).concat(variations).includes("color"))) && (
                                <span className='input-error'>{stringValidator("Color", formData.color, 2, 40, Object.keys(commonFields).concat(variations).includes("color"))}</span>
                            )}
                        </div>
                    )}


                    <div className='single-line'>

                        {categoryConfig[category].properties.includes("ram") && (
                            <div className='input-section'>
                                <label className='label1' htmlFor="ram">{`Ram${Object.keys(commonFields).concat(variations).includes("ram") ? "*" : ""}`}</label>
                                <input
                                    onChange={formInputChangeHandler}
                                    className={`${(validateFields && !!numberValidator("Ram", formData.ram, 1, 10000, Object.keys(commonFields).concat(variations).includes("ram"))) ? "invalid" : ""}  input1`}
                                    type="number"
                                    name="ram"
                                    id="ram"
                                    onWheel={() => document.activeElement.blur()}
                                    spellCheck={false}
                                    value={formData.ram}
                                />
                                {(validateFields && !!!!numberValidator("Ram", formData.ram, 1, 10000, Object.keys(commonFields).concat(variations).includes("ram"))) && (
                                    <span className='input-error'>{numberValidator("Ram", formData.ram, 1, 10000, Object.keys(commonFields).concat(variations).includes("ram"))}</span>
                                )}
                            </div>
                        )}

                        {categoryConfig[category].properties.includes("storage") && (
                            <div className='input-section'>
                                <label className='label1' htmlFor="storage">{`Storage${Object.keys(commonFields).concat(variations).includes("storage") ? "*" : ""}`}</label>
                                <input
                                    onChange={formInputChangeHandler}
                                    className={`${(validateFields && !!numberValidator("Storage", formData.storage, 1, 10000, Object.keys(commonFields).concat(variations).includes("storage"))) ? "invalid" : ""}  input1`}
                                    type="number"
                                    name="storage"
                                    id="storage"
                                    onWheel={() => document.activeElement.blur()}
                                    spellCheck={false}
                                    value={formData.storage}
                                />
                                {(validateFields && !!numberValidator("Storage", formData.storage, 1, 10000, Object.keys(commonFields).concat(variations).includes("storage"))) && (
                                    <span className='input-error'>{numberValidator("Storage", formData.storage, 1, 10000, Object.keys(commonFields).concat(variations).includes("storage"))}</span>
                                )}
                            </div>
                        )}
                    </div>



                    {categoryConfig[category].properties.includes("processor") && (
                        <div className='input-section'>
                            <label className='label1' htmlFor="processor">{`Processor${Object.keys(commonFields).concat(variations).includes("processor") ? "*" : ""}`}</label>
                            <input
                                type='text'
                                className={`${(validateFields & !!stringValidator("Processor", formData.processor, 5, 100, Object.keys(commonFields).concat(variations).includes("processor"))) ? "invalid" : ""}  input1`}
                                name="processor"
                                id='processor'
                                onChange={formInputChangeHandler}
                                spellCheck={false}
                                value={formData.processor}
                            />
                            {(validateFields && !!stringValidator("Processor", formData.processor, 5, 100, Object.keys(commonFields).concat(variations).includes("processor"))) && (
                                <span className='input-error'>{stringValidator("Processor", formData.processor, 5, 100, Object.keys(commonFields).concat(variations).includes("processor"))}</span>
                            )}
                        </div>
                    )}


                    <div className='single-line'>

                        {categoryConfig[category].properties.includes("size") && (
                            <div className='input-section'>
                                <label className='label1' htmlFor="size">{`Size${Object.keys(commonFields).concat(variations).includes("size") ? "*" : ""}`}</label>
                                <input
                                    type='text'
                                    className={`${(validateFields & !!stringValidator("Size", formData.size, 2, 10, Object.keys(commonFields).concat(variations).includes("size"))) ? "invalid" : ""}  input1`}
                                    name="size"
                                    id='size'
                                    onChange={formInputChangeHandler}
                                    spellCheck={false}
                                    value={formData.size}
                                />
                                {(validateFields && !!stringValidator("Size", formData.size, 2, 10, Object.keys(commonFields).concat(variations).includes("size"))) && (
                                    <span className='input-error'>{stringValidator("Size", formData.size, 2, 10, Object.keys(commonFields).concat(variations).includes("size"))}</span>
                                )}
                            </div>
                        )}


                        {categoryConfig[category].properties.includes("quantity") && (
                            <div className='input-section'>
                                <label className='label1' htmlFor="quantity">{`Quantity${Object.keys(commonFields).concat(variations).includes("quantity") ? "*" : ""}`}</label>
                                <input
                                    onChange={formInputChangeHandler}
                                    className={`${(validateFields & !!numberValidator("Quantity", formData.quantity, 1, 10000, Object.keys(commonFields).concat(variations).includes("quantity"))) ? "invalid" : ""}  input1`}
                                    type="number"
                                    name="quantity"
                                    id="quantity"
                                    onWheel={() => document.activeElement.blur()}
                                    spellCheck={false}
                                    value={formData.quantity}
                                />
                                {(validateFields & !!numberValidator("Quantity", formData.quantity, 1, 10000, Object.keys(commonFields).concat(variations).includes("quantity"))) && (
                                    <span className='input-error'>{numberValidator("Quantity", formData.quantity, 1, 10000, Object.keys(commonFields).concat(variations).includes("quantity"))}</span>
                                )}
                            </div>
                        )}
                    </div>


                    <div className="btn-container">
                        <button
                            onClick={removeClickHandler}
                            className='inferior-btn'
                            type="button"
                        >
                            Remove
                        </button>
                        <button
                            className='secondary-btn'
                            type="submit"
                        >
                            Add
                        </button>
                    </div>
                </form>
            )}
        </>
    )
}

export default CreateProductForm
