import React, { useEffect, useState } from "react";
import { areKeysEqualExceptForKey, getAllVariations } from "./utils";
import { useNavigate } from "react-router-dom";


const ProductVariations = ({ products, mainProduct, images }) => {

    const [allVariations, setAllVariations] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (products && products.length > 0) {
            setAllVariations(getAllVariations(products));
        }
    }, [products]);


    const checkAvailability = (variationType, variationValue) => {
        for (let i = 0; i < products.length; i++) {
            if(products[i][variationType] === variationValue){
                if (areKeysEqualExceptForKey(products[i], mainProduct, Object.keys(allVariations.variations), variationType)) {
                    return true;
                }
            }
        }

        return false;
    }


    const variationChange = (e) => {

        let found = false;
        for (let i = 0; i < products.length; i++) {
            if ((products[i][e.target.name].toString() === e.target.value)) {
                if (areKeysEqualExceptForKey(products[i], mainProduct, Object.keys(allVariations.variations), e.target.name)) {
                    found = true
                    navigate(`/product/${products[i]._id}`);
                    break
                }
            }
        }

        if (!found) {
            for (const product of products) {
                if (product[e.target.name].toString() === e.target.value) {
                    navigate(`/product/${product._id}`);
                }
            }
        }
    }


    const getImage = (variation, variationValue) => {
        for (const product of products) {
            if (product[variation] === variationValue) {
                return images[0];
            }
        }
    }


    return (
        <>
            {(allVariations && Object.keys(allVariations).length > 0) && (

                <div className="product-variations">

                    {Object.keys(allVariations.variations).map((variation, index) => {
                        return (
                            <div key={index} className='variation-container'>
                                <div className="variation-type">{variation}:</div>

                                <div className="variation-product-items">
                                    {
                                        (variation === "color") ? (
                                            allVariations.variations[variation].map((type, index) => {
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
                                                                <span
                                                                    className={(mainProduct[variation] !== type) ? "custom-tooltip" : ""}
                                                                    data-tooltip={`${(mainProduct[variation] === type) ? "" : checkAvailability(variation, type) ? `Click to select ${type}` : `See available options in ${type}`}`}
                                                                >

                                                                    <div className="product-item">
                                                                        <div className="variation-product-image">
                                                                            <img src={getImage(variation, type)} alt="variation-img" />
                                                                        </div>
                                                                        <div className="product-variation">{type}</div>
                                                                    </div>

                                                                </span>
                                                            </div>
                                                        </label>

                                                    </div>
                                                )
                                            })
                                        ) : (

                                            allVariations.variations[variation].map((type, index) => {
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
                                                                <span
                                                                    className={(mainProduct[variation] !== type) ? "custom-tooltip" : ""}
                                                                    data-tooltip={`${(mainProduct[variation] === type) ? "" : checkAvailability(variation, type) ? `Click to select ${type}` : `See available options in ${type}`}`}
                                                                >
                                                                    <div className="product-variation variation-button">
                                                                        {type}
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        )
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
