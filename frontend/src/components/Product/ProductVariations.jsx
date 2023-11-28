import React, { useEffect, useState } from "react";
import { areKeysEqualExceptForKey, getAllVariations } from "./utils";
import { useNavigate } from "react-router-dom";


const ProductVariations = ({ variationProducts, mainProduct, images }) => {

    const [allVariations, setAllVariations] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (variationProducts && variationProducts.length > 0) {
            setAllVariations(() => getAllVariations(variationProducts, mainProduct));
        }

        // eslint-disable-next-line
    }, [variationProducts]);


    const checkAvailability = (variationType, variationValue) => {
        for (let i = 0; i < variationProducts.length; i++) {
            if (variationProducts[i][variationType] === variationValue) {
                if (areKeysEqualExceptForKey(variationProducts[i], mainProduct, Object.keys(allVariations), variationType)) {
                    return true;
                }
            }
        }
        return false;
    }


    const variationChange = (e) => {
        let found = false;
        for (let i = 0; i < variationProducts.length; i++) {
            if ((variationProducts[i][e.target.name].toString() === e.target.value)) {
                if (areKeysEqualExceptForKey(variationProducts[i], mainProduct, Object.keys(allVariations), e.target.name)) {
                    found = true
                    navigate(`/product/${variationProducts[i]._id}`);
                    break
                }
            }
        }

        if (!found) {
            for (const product of variationProducts) {
                if (product[e.target.name].toString() === e.target.value) {
                    navigate(`/product/${product._id}`);
                }
            }
        }
    }


    const getImage = (variation, variationValue) => {
        for (const product of variationProducts) {
            if (product[variation] === variationValue) {
                return product.image;
            }
        }
    }


    return (
        <>
            {(!!allVariations && Object.keys(allVariations).length > 0) && (

                <div className="product-variations">

                    {Object.keys(allVariations).map((variation, index) => {
                        return (
                            <div key={index} className='variation-container'>
                                <div className="variation-type">{variation}:</div>

                                <div className="variation-product-items">
                                    {(variation === "color") ? (
                                        allVariations[variation].map((type, index) => {
                                            return (
                                                <div key={index}>
                                                    <input
                                                        onClick={variationChange}
                                                        type="checkbox"
                                                        name={variation}
                                                        id={type}
                                                        checked={(mainProduct[variation] === type)}
                                                        value={type}
                                                        readOnly
                                                    />

                                                    <label htmlFor={type}>
                                                        <div
                                                            className={`product-item ${(mainProduct[variation] === type) ? "" : checkAvailability(variation, type) ? "" : "not-available"}`}
                                                        >

                                                            <div className="product-item">
                                                                <div className="variation-product-image">
                                                                    <img src={getImage(variation, type)} alt="variation-img" />
                                                                </div>
                                                                <div className="product-variation">{type}</div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            )
                                        })
                                    ) : (allVariations[variation].map((type, index) => {
                                        return (
                                            <div key={index}>
                                                <input
                                                    onClick={variationChange}
                                                    type="checkbox"
                                                    name={variation}
                                                    id={type}
                                                    checked={(mainProduct[variation] === type)}
                                                    value={type}
                                                    readOnly
                                                />

                                                <label htmlFor={type}>
                                                    <div
                                                        className={`product-item ${(mainProduct[variation] === type) ? "" : checkAvailability(variation, type) ? "" : "not-available"}`}
                                                    >
                                                        <div className="product-variation variation-button">
                                                            {type}
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        )
                                    }))
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}

export default ProductVariations;
