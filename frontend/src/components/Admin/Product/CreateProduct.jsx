import React, { useContext, useEffect, useRef, useState } from 'react'
import Accordion from '../../elements/Accordians/Accordion';
import { categoryValidator, inputValidator } from './utils';
import ProductAccordian from './ProductAccordian';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { adminActionCreators } from '../../../State/action-creators';
import Loader2 from '../../layouts/Loader/Loader2';
import { toast } from 'react-toastify';
import { CREATE_PRODUCT_RESET } from '../../../State/constants/AdminConstants';
import { ModalContext } from '../../../Context/ModalContext';
import { categoryConfig } from '../../Data';


const CreateProduct = () => {

    const { creatingProduct, createdProduct, createProductError } = useSelector(state => state.createProduct);

    const { openModal, closeModal } = useContext(ModalContext);

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
    const [productState, setProductState] = useState(Array(null).fill({ added: false, active: true }));
    const errorRef = useRef(null);
    const successRef = useRef(null);

    const dispatch = useDispatch();

    const { createProductAction } = bindActionCreators(adminActionCreators, dispatch);

    useEffect(() => {
        toast.error(createProductError, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [createProductError]);


    useEffect(() => {
        if(createdProduct === true){
            resetCreateProductForm();
            successRef.current.style.display = "flex";
            window.scrollTo(0,0);
        }
    }, [createdProduct]);


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
        setProductState(Array(null).fill({ added: false, active: true }));
        setDisableCommonFields(false);
        setVariations([]);
    }


    const isFormDatavalid = () => {
        const validtors = [
            !!inputValidator("brand", "Brand", commonFields.brand, 3, 50),
            categoryValidator(categoryConfig, commonFields.category),
        ];
        return validtors.every(validator => !validator) && variations.length > 0;
    }


    const saveCommonFieldsHandler = (e) => {
        e.preventDefault();

        setValidateFields(true);

        if (isFormDatavalid()) {
            setProductCount(1);
            setDisableCommonFields(true);
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
        setProductState(prev => prev.filter((_, index) => index + 1 !== prodNum))
    }


    useEffect(() => {
        if (productCount > productState.length) {
            setProductState(prev => [...prev, ...new Array(productCount - prev.length).fill({ active: true, added: false })]);
        }
        // eslint-disable-next-line
    }, [productCount]);


    useEffect(() => {
        if ((productCount !== 0) && (productCount === productState.length) && productState.every(state => state.added === true)) {
            errorRef.current.style.display = "none";
        }
        else if (productCount === 0) {
            errorRef.current.style.display = "none";
        }
        // eslint-disable-next-line
    }, [productState]);


    const resetClickHandler = () => {

        const modalContent = (
            <>
                <div className="modal-caption">
                    The data you've entered till now to create your product would be lost.
                </div>

                <div className="modal-btn-container">
                    <button type="button" onClick={closeModal} className='secondary-btn'>No</button>
                    <button 
                        type="button" 
                        onClick={() => {
                            resetCreateProductForm();
                            closeModal();
                        }}
                        className='main-btn'
                    >
                        Yes
                    </button>
                </div>
            </>
        )

        openModal("Are you sure you would like to reset your progress?", modalContent);
    }


    const createProductClickHandler = () => {
        if ((productCount !== 0) && (productCount === productState.length) && productState.every(state => state.added === true)) {
            errorRef.current.style.display = "none";

            createProductAction(products, variations, commonFields.brand, commonFields.category);
        }
        else {
            window.scrollTo({
                top: errorRef.current.offsetTop,
            });
            errorRef.current.style.display = "flex";
        }
    };


    return (

        <div className="profile-page-content">

            <div className="page-head">Create Product</div>

            <div className="create-product-container">

                <div ref={successRef} className="success-alert" style={{ marginTop: "40px", display: "none" }}>
                    Successfully created your product.
                </div>

                {!showCommonFieldsForm && (
                    <div
                        onClick={() =>{
                            if(createdProduct === true){
                                dispatch({ type: CREATE_PRODUCT_RESET })
                                successRef.current.style.display = "none";
                            }
                            setShowCommonFieldsForm(true);
                        }} 
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
                                        `${(validateFields && !!inputValidator("brand", "Brand", commonFields.brand, 3, 50)) ? "invalid" : ""}  input1`
                                    }
                                    type="text"
                                    name="brand"
                                    id="brand"
                                    spellCheck={false}
                                    value={commonFields.brand}
                                    disabled={disableCommonFields}
                                />
                                {(validateFields && !!inputValidator("brand" ,"Brand", commonFields.brand, 3, 50)) && (
                                    <span className='input-error'>{inputValidator("brand" ,"Brand", commonFields.brand, 3, 50)}</span>
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
                                {(productCount > 0) && showCommonFieldsForm && !disableCommonFields && (
                                    <div className="input-caption">Changing the category now may potentially reset the details you've filled in so far.</div>
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
                                            onClick={resetClickHandler}
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

                        <div ref={errorRef} className="error-alert" style={{ marginTop: "40px", display: "none" }}>
                            Please verify all fields below.
                        </div>

                        <div className='products-container'>
                            {(productCount > 0) ? (
                                <>
                                    {[...Array(productCount)].map((_, index) => {
                                        return (
                                            <ProductAccordian
                                                key={index}
                                                productState={productState[index]}
                                                setProductState={(value) => {
                                                    let newProductState = [...productState];
                                                    newProductState[index] = value;
                                                    setProductState(newProductState);
                                                }}
                                                category={commonFields.category}
                                                config={categoryConfig}
                                                productCount={index + 1}
                                                variations={variations}
                                                products={products}
                                                setProducts={setProducts}
                                                removeProduct={removeProductHandler}
                                            />
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
                                        activeProp={true}
                                    />


                                    <div className="create-product-btn-container">
                                        <button
                                            type="button"
                                            className='main-btn loader-btn'
                                            onClick={createProductClickHandler}
                                            disabled={creatingProduct}
                                        >
                                            {creatingProduct === true ? (<Loader2 />) : "Create Product"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                (productCount === 0) && (
                                    <Accordion
                                        title={`Product ${productCount + 1}`}
                                        content={
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setProductCount(1);
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

export default CreateProduct;
