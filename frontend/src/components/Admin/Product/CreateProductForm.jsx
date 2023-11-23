import React, { useContext, useEffect, useRef, useState } from 'react'
import { inputValidator } from './utils';
import { ModalContext } from '../../../Context/ModalContext';
import { commonFields, allFieldsRange, allFields } from '../../Data';

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
        return Object.keys(allFields).every((field) => {
            if (formData[field] !== undefined) {
                return !inputValidator("_", formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(variations).includes(field));
            }
            else {
                return true;
            }
        });
    }

    const formInputChangeHandler = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value.slice(0, allFieldsRange[e.target.name][1] ? allFieldsRange[e.target.name][1] : e.target.value.length)
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
        (Object.keys(categoryConfig).includes(category) && categoryConfig[category].properties.every(prop => Object.keys(formData).includes(prop))) && (

            <form onSubmit={onSubmit} method="post">

                <div className="form-instruction" style={{ marginBottom: "8px" }}>*Required fields</div>

                <div ref={errorRef} className="error-alert" style={{ marginBottom: "10px", display: "none" }}>
                    Please verify all fields below.
                </div>

                {Object.keys(formData).map((field, index) => (
                    <div key={index} className='input-section'>
                        <label className='label1' htmlFor={field}>{`${field.replace("_", " ")}${Object.keys(commonFields).concat(variations).includes(field) ? "*" : ""}`}</label>
                        <input
                            onChange={formInputChangeHandler}
                            className={
                                `${(validateFields && !!inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(variations).includes(field))) ? "invalid" : ""}  input1`
                            }
                            type={["price", "discount_percent", "stock", "ram", "storage", "quantity"].includes(field) ? "number" : "text"}
                            name={field}
                            id={field}
                            spellCheck={false}
                            onWheel={() => document.activeElement.blur()}
                            value={formData[field]}
                        />
                        {(validateFields && !!inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(variations).includes(field))) && (
                            <span className='input-error'>{inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(variations).includes(field))}</span>
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
