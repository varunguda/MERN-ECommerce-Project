import React, { useContext, useEffect, useState } from 'react'
import { allFields, allFieldsRange, commonFields } from '../../Data';
import { ModalContext } from '../../../Context/ModalContext';
import { inputValidator } from '../../Admin/Product/utils';

const EditProductForm = ({ product, updateProduct }) => {

    const { closeModal } = useContext(ModalContext);

    const [formData, setFormData] = useState({});
    const [validateFields, setValidateFields] = useState(false);

    useEffect(() => {
        return () => {
            setFormData({});
            setValidateFields(false);
        }
    }, []);

    useEffect(() => {
        if(product && Object.keys(product).length > 0){
            let obj = {};
            Object.keys(product).forEach(field => {
                if(Object.keys(allFields).includes(field)){
                    obj[field] = product[field];
                }
            });
            setFormData(obj);
        }
        // eslint-disable-next-line
    }, [product]);


    const isFormDatavalid = () => {
        return Object.keys(allFields).filter(field => field !== "images").every((field) => {
            if (formData[field] !== undefined) {
                return !inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(product.variations).includes(field));
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

    const onSubmit = (e) => {
        e.preventDefault();
        setValidateFields(true);
        if (isFormDatavalid()) {
            updateProduct(formData);
        }
    }


    return (
        (!!formData && Object.keys(formData).length > 0) && (

            <form onSubmit={onSubmit}>
                {Object.keys(formData).filter(field => field !== "images").map((field, index) => (
                    <div key={index} className='input-section'>
                        <label className='label1' htmlFor={field}>{`${field.replace("_", " ")}${Object.keys(commonFields).concat(product.variations).includes(field) ? "*" : ""}`}</label>
                        <input
                            onChange={formInputChangeHandler}
                            className={
                                `${(validateFields && !!inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(product.variations).includes(field))) ? "invalid" : ""}  input1`
                            }
                            type={["price", "discount_percent", "stock", "ram", "storage", "quantity"].includes(field) ? "number" : "text"}
                            name={field}
                            id={field}
                            onWheel={() => document.activeElement.blur()}
                            spellCheck={false}
                            value={formData[field]}
                        />
                        {(validateFields && !!inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(product.variations).includes(field))) && (
                            <span className='input-error'>{inputValidator(field, formData[field], allFieldsRange[field][0], allFieldsRange[field][1], Object.keys(commonFields).concat(product.variations).includes(field))}</span>
                        )}
                    </div>
                ))}

                <div className="modal-btn-container" style={{ marginTop: "40px" }}>
                    <button
                        onClick={closeModal}
                        className='inferior-btn'
                        type="button"
                    >
                        Close
                    </button>
                    <button
                        className='main-btn'
                        type="submit"
                    >
                        Save
                    </button>
                </div>
            </form>
        )
    )
}

export default EditProductForm;
