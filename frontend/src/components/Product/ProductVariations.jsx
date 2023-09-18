import React, { useEffect, useState } from "react";
import { getAllVariations } from "./utils";
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
        let isExist = false;

        for (const product of products) {
            for (const variation of Object.keys(allVariations.variations)) {
                if (variation === variationType) {
                    continue;
                }
                if ((mainProduct[variation] === product[variation]) && (product[variationType] === variationValue)) {
                    isExist = true;
                    break;
                }
            }
            if (isExist) {
                break;
            }
        }

        return isExist;
    }


    const variationChange = (e) => {
        let found = false;
        for (const product of products) {
            for (const variation of Object.keys(allVariations.variations)) {
                if (variation === e.target.name) {
                    continue;
                }

                if ((product[e.target.name] === e.target.value) && (product[variation] === mainProduct[variation])) {
                    found = true
                    navigate(`/products/${product._id}`);
                    break
                }
            }
        }

        if (!found) {
            for (const product of products) {
                if (product[e.target.name] === e.target.value) {
                    navigate(`/products/${product._id}`);
                    break
                }
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
                                        allVariations.variations[variation].map((type, index) => {
                                            return (
                                                <div key={index}>

                                                    <input onClick={variationChange} type="checkbox" name={variation} id={type} checked={(mainProduct[variation] === type)} value={type} readOnly />

                                                    <label htmlFor={type}>
                                                        <div className={`product-item ${(mainProduct[variation] === type) ? "" : checkAvailability(variation, type) ? "" : "not-available"}`}>
                                                            <span className={(mainProduct[variation] !== type) ?"custom-tooltip" : ""} data-tooltip={`Click to select ${type}`}>
                                                                <div className="product-variation variation-button">
                                                                    {type}
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </label>

                                                </div>
                                            )
                                        })
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
