import React, { useEffect, useState } from 'react';
import DropdownButton from '../elements/Buttons/DropdownButton';

import "./SortComponent.css";
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigationActionCreators } from '../../State/action-creators';

const sortValues = {
    "naz": "Title: A-Z",
    "nza": "Title: Z-A",
    "plth": "Price: Low to High",
    "phtl": "Price: High to Low",
    "dhtl": "Discount: High to Low",
    "dlth": "Discount: Low to High",
    "rhtl": "Rating: High to Low",
    "rlth": "Rating: Low to High",
    "trhtl": "Total Reviews: High to Low",
    "trlth": "Total Reviews: Low to High"
}

const SortComponent = ({ sort_by }) => {

    const dispatch = useDispatch();
    const { setSort } = bindActionCreators(navigationActionCreators, dispatch);
    
    const [selectedSort, setSelectedSort] = useState(sort_by ? sort_by : "");

    const sortClickHandler = (e) => {
        if (e.target.name !== "" && e.target.name !== "rele") {
            setSelectedSort(e.target.name);
        }
        else if(e.target.name === "rele"){
            setSelectedSort("");
        }
    }

    useEffect(() => {
        if (selectedSort) {
            setSort(selectedSort);
        }
        else if( selectedSort === "") {
            setSort("");
        }
        // eslint-disable-next-line
    }, [selectedSort]);


    return (
        <>
            <DropdownButton
                name={<><span style={{ fontWeight: "600" }}>Sort by </span>| &nbsp;{sort_by ? sortValues[sort_by] : "Relevance"}</>}
                content={
                    <div className='dropdown-container'>
                        <div className='dropdown-elems' onClick={sortClickHandler}>

                                <div className='sort-elem'>
                                    <input type='checkbox' name="rele" id="rele" checked={selectedSort === ""} readOnly />
                                    <label htmlFor="rele">Relevance</label>
                                </div>

                            {
                                Object.keys(sortValues).map((elem, index) => {
                                    return (
                                        <div key={index} className='sort-elem'>
                                            <input type='checkbox' name={elem} id={elem} checked={selectedSort === elem} readOnly />
                                            <label htmlFor={elem}>{sortValues[elem]}</label>
                                        </div>
                                    )
                                })
                            }

                        </div>
                    </div>
                }
            />
        </>
    )
}

export default SortComponent;
