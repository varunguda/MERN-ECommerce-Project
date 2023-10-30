import React, { useEffect, useState } from 'react'
import Accordion from '../../elements/Accordians/Accordion';
import { categoryValidator, stringValidator } from './utils';
import ProductAccordian from './ProductAccordian';



const categoryConfig = {

    "Mobile Phone": {
        properties: ["ram", "storage", "color", "processor"]
    },

    "Laptop": {
        properties: ["ram", "color", "processor", "storage", "size"]
    },

    "Monitor": {
        properties: ["color", "size"]
    },

    "Clothing": {
        properties: ["size", "color"]
    },

    "Shoes": {
        properties: ["color", "size"]
    },

    "Watches": {
        properties: ["color"]
    },

    "Telivision": {
        properties: ["color", "size"],
    },

    "Refrigerator": {
        properties: ["color", "size"],
    },

    "Washing Machines": {
        properties: ["color", "size"],
    },

    "Accessories": {
        properties: ["color", "size"],
    },

    "Audio devices": {
        properties: ["color"],
    },

    "Beauty & Health": {
        properties: ["quantity"],
    }
}



const CreateProduct = () => {

    const [showCommonFieldsForm, setShowCommonFieldsForm] = useState(false);
    const [validateFields, setValidateFields] = useState(false);
    const [commonFields, setCommonFields] = useState({
        brand: "",
        category: ""
    });
    const [disableCommonFields, setDisableCommonFields] = useState(false);
    const [variations, setVariations] = useState([]);
    const [productCount, setProductCount] = useState(null);
    const [products, setProducts] = useState([]);
    const [productAdded, setProductAdded] = useState(Array(productCount).fill(false));


    const commonFieldsChangeHandler = (e) => {
        const maxLength = {
            brand: 50,
        };

        setCommonFields((prev) => ({
            ...prev,
            [e.target.name]: e.target.value.slice(0, maxLength[e.target.name] ? maxLength[e.target.name] : e.target.value.length)
        }));
    }


    const resetCreateProductForm = () => {
        setCommonFields({
            brand: "",
            category: ""
        })
        setValidateFields(false);
        setShowCommonFieldsForm(false);
        setProductCount(null);
        setDisableCommonFields(false);
        setVariations([]);
    }


    const isFormDatavalid = () => {
        const validtors = [
            stringValidator("Brand", commonFields.brand, 1, 50),
            categoryValidator(categoryConfig, commonFields.category),
        ];

        return validtors.every(validator => !validator) && variations.length > 0;
    }


    const saveCommonFieldsHandler = (e) => {
        e.preventDefault();

        setValidateFields(true);

        if (isFormDatavalid()) {
            setProductCount(1);
            setDisableCommonFields(true)
        }
    }


    const handleVariationCheck = (e) => {
        if (variations.includes(e.target.name)) {
            setVariations(prev => prev.filter((vari) => vari !== e.target.name));
        } else {
            setVariations(prev => [...prev, e.target.name]);
        }
    }


    const removeProductHandler = (prodNum) => {
        setProducts(prev => prev.filter((_, index) => index + 1 !== prodNum));
        setProductCount(prev => prev - 1);
        setProductAdded(prev => prev.filter((_, index) => index + 1 !== prodNum))
    }

    useEffect(() => {
        if (productCount > productAdded.length) {
            setProductAdded(prev => [...prev, ...new Array(productCount - prev.length).fill(false)]);
        }
        // eslint-disable-next-line
    }, [productCount]);

    useEffect(() => {
        console.log({products});
    }, [products]);

    useEffect(() => {
        console.log({productAdded});
    }, [productAdded]);


    return (

        <div className="profile-page-content">

            <div className="page-head">Create Product</div>

            <div className="create-product-container">

                {!showCommonFieldsForm && (
                    <div
                        onClick={() => setShowCommonFieldsForm(true)}
                        className="inferior-btn"
                    >
                        + Add Product
                    </div>
                )}

                {showCommonFieldsForm && (
                    <>
                        <form onSubmit={saveCommonFieldsHandler}>

                            <div className='input-section'>
                                <label className='label1' htmlFor="brand">Brand*</label>
                                <input
                                    onChange={commonFieldsChangeHandler}
                                    className={
                                        `${(validateFields && !!stringValidator("Brand", commonFields.brand, 1, 50)) ? "invalid" : ""}  input1`
                                    }
                                    type="text"
                                    name="brand"
                                    id="brand"
                                    spellCheck={false}
                                    value={commonFields.brand}
                                    disabled={disableCommonFields}
                                />
                                {(validateFields && !!stringValidator("Brand", commonFields.brand, 1, 50)) && (
                                    <span className='input-error'>{stringValidator("Brand", commonFields.brand, 1, 50)}</span>
                                )}
                            </div>


                            <div className='input-section'>
                                <label className='label1' htmlFor="category">Category*</label>
                                <select
                                    className={
                                        `${(validateFields && !!categoryValidator(categoryConfig, commonFields.category)) ? "invalid" : ""}  input1`
                                    }
                                    name="category"
                                    id='category'
                                    onChange={commonFieldsChangeHandler}
                                    spellCheck={false}
                                    value={commonFields.category}
                                    disabled={disableCommonFields}
                                >
                                    <option value=""></option>
                                    {Object.keys(categoryConfig).map((category, index) => {
                                        return <option key={index}>{category}</option>
                                    })}
                                </select>
                                {(validateFields && !!categoryValidator(categoryConfig, commonFields.category)) && (
                                    <span className='input-error'>{categoryValidator(categoryConfig, commonFields.category)}</span>
                                )}
                            </div>


                            {(commonFields.category && !categoryValidator(categoryConfig, commonFields.category)) && (
                                <div className='variations-container'>

                                    <div className="container-head">Variations*</div>

                                    {categoryConfig[commonFields.category].properties.map((prop, index) => {
                                        return (
                                            <div key={index} className="checkboxes">
                                                <input
                                                    type="checkbox"
                                                    name={prop}
                                                    value={prop}
                                                    checked={variations.includes(prop)}
                                                    onChange={handleVariationCheck}
                                                    id={prop}
                                                    disabled={disableCommonFields}
                                                />
                                                <label htmlFor={prop}>{prop}</label>
                                            </div>
                                        )
                                    })}
                                    {(validateFields && variations.length === 0) && (
                                        <div className="input-section">
                                            <span className='input-error'>Please select atleast one variation</span>
                                        </div>
                                    )}
                                </div>
                            )}


                            <div className="btn-container">
                                {!disableCommonFields ? (
                                    <>
                                        <button
                                            onClick={resetCreateProductForm}
                                            className='inferior-btn'
                                            type="button"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            className='secondary-btn'
                                            type="submit"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={resetCreateProductForm}
                                            className='inferior-btn'
                                            type="button"
                                        >
                                            Reset
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setDisableCommonFields(false);
                                            }}
                                            className='secondary-btn'
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>


                        <div className='products-container'>
                            {(productCount > 0) ? (
                                <>
                                    {[...Array(productCount)].map((_, index) => {
                                        return (
                                            <div key={index}>
                                                <ProductAccordian
                                                    productAdded={productAdded[index]}
                                                    setProductAdded={(value) => {
                                                        let newProductAdded = [...productAdded];
                                                        newProductAdded[index] = value;
                                                        setProductAdded(newProductAdded);
                                                    }}
                                                    category={commonFields.category}
                                                    config={categoryConfig}
                                                    productCount={index + 1}
                                                    variations={variations}
                                                    products={products}
                                                    setProducts={setProducts}
                                                    removeProduct={removeProductHandler}
                                                />
                                            </div>
                                        )
                                    })}

                                    <Accordion
                                        title={`Product ${productCount + 1}`}
                                        content={
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setProductCount(prev => prev + 1);
                                                    }}
                                                    type="button"
                                                    style={{ fontSize: "1rem" }}
                                                    className='inferior-btn'
                                                >
                                                    + Add a similar product
                                                </button>
                                            </>
                                        }
                                    />
                                </>
                            ) : (
                                (productCount === 0) && (
                                    <Accordion
                                        title={`Product ${productCount + 1}`}
                                        content={
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setProductCount(prev => prev + 1);
                                                    }}
                                                    type="button"
                                                    style={{ fontSize: "1rem" }}
                                                    className='inferior-btn'
                                                >
                                                    + Add a product
                                                </button>
                                            </>
                                        }
                                    />
                                )
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CreateProduct
