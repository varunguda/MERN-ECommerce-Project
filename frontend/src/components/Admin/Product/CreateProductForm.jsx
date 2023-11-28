import React, { useContext, useEffect, useRef, useState } from 'react'
import { inputValidator } from './utils';
import { ModalContext } from '../../../Context/ModalContext';
import { commonFields, allFieldsRange, allFields } from '../../Data';
import IconPlus from '@tabler/icons-react/dist/esm/icons/IconPlus.js';
import IconTrash from '@tabler/icons-react/dist/esm/icons/IconTrash';


const CreateProductForm = ({ category, categoryConfig, setResize, variations, setProducts, productCount, removeProduct, setProductState, setActiveState }) => {

    const { openModal, closeModal } = useContext(ModalContext);

    const [formData, setFormData] = useState(allFields);
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
        return Object.keys(allFields).filter(field => field !== "images").every((field) => {
            if (formData[field] !== undefined) {
                return !inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(variations).includes(field));
            }
            else {
                return true;
            }
        });
    };

    const formInputChangeHandler = (e) => {
        if (e.target.name === `product-img${productCount}`) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    let images = formData.images.concat([reader.result]);
                    setFormData(prev => ({ ...prev, images }));
                }
            };
            const file = e.target.files[0];
            if (file) {
                reader.readAsDataURL(file);
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value.slice(0, allFieldsRange[e.target.name][1] ? allFieldsRange[e.target.name][1] : e.target.value.length)
            }));
        }
    };

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
    };

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
                    if (index === (productCount - 1)) {
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
    };

    const removeImage = (index) => {
        let images = formData.images;
        images.splice(index, 1);
        setFormData(prev => ({...prev, images }));
        closeModal();
    };

    const removeImageHandler = (index) => {
        openModal(
            "Are you sure you want to remove this image?",
            <>
                <div className="modal-btn-container">
                    <button onClick={closeModal} type="button" className='inferior-btn'>No</button>
                    <button onClick={() => removeImage(index)} type="button" className='main-btn warning'>Yes</button>
                </div>
            </>
        )
    };


    return (
        (Object.keys(categoryConfig).includes(category) && categoryConfig[category].properties.every(prop => Object.keys(formData).includes(prop))) && (

            <form onSubmit={onSubmit} method="post">

                <div className="form-instruction" style={{ marginBottom: "8px" }}>*Required fields</div>

                <div ref={errorRef} className="error-alert" style={{ marginBottom: "10px", display: "none" }}>
                    Please verify all fields below.
                </div>

                <div className="product-images-container">
                    <div className='label1'>Product Images*</div>
                    <div className="product-images">
                        {formData.images.map((image, index) => (
                            <div key={index} onClick={() => removeImageHandler(index)} className="img-container">
                                <img src={image} alt="product-img-preview" />
                                <span className="delete-cover">
                                    <IconTrash strokeWidth={1.25} color="white" />
                                </span>
                            </div>
                        ))}

                        {(formData.images.length < 10) && (
                            <>
                                <label htmlFor={`product-img${productCount}`} className={(validateFields && formData.images.length === 0) ? "invalid" : ""}>
                                    <IconPlus strokeWidth={1.25} color={(validateFields && formData.images.length === 0) ? "#de1c24" : "#74767c"} size={20} />
                                    Add Image
                                </label>
                                <input
                                    type="file"
                                    id={`product-img${productCount}`}
                                    name={`product-img${productCount}`}
                                    accept="image/*"
                                    onChange={formInputChangeHandler}
                                />
                            </>
                        )}
                    </div>
                    {(validateFields && formData.images.length === 0) && (
                        <div className="input-section">
                            <span className='input-error'>Product images are required</span>
                        </div>
                    )}
                </div>

                {Object.keys(formData).filter(key => key !== "images").map((field, index) => (
                    <div key={index} className='input-section'>
                        <label className='label1' htmlFor={field}>{`${field.replace("_", " ")}${field !== "discount_percent" && Object.keys(commonFields).concat(variations).includes(field) ? "*" : ""}`}</label>
                        <input
                            onChange={formInputChangeHandler}
                            className={
                                `${(validateFields && !!inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], field !== "discount_percent" && Object.keys(commonFields).concat(variations).includes(field))) ? "invalid" : ""}  input1`
                            }
                            type={["price", "discount_percent", "stock", "ram", "storage", "quantity"].includes(field) ? "number" : "text"}
                            name={field}
                            id={field}
                            spellCheck={false}
                            onWheel={() => document.activeElement.blur()}
                            value={formData[field]}
                        />
                        {(validateFields && !!inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], field !== "discount_percent" && Object.keys(commonFields).concat(variations).includes(field))) && (
                            <span className='input-error'>{inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], field !== "discount_percent" && Object.keys(commonFields).concat(variations).includes(field))}</span>
                        )}
                    </div>
                ))}

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
        )
    )
}

export default CreateProductForm;
