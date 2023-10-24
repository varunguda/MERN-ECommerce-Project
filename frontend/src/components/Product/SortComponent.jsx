import React, { useEffect, useState } from 'react';
import DropdownButton from '../elements/Buttons/DropdownButton';
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

    const sortClickHandler = (val) => {
        const selected = Object.keys(sortValues).filter(v => sortValues[v] === val);

        if(selected.length === 0){
            setSelectedSort("");
        } else {
            setSelectedSort(selected[0]);
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
                contentArr={ Object.keys(sortValues).map((elem, index) => { return sortValues[elem] }) }
                clickedElem={val => sortClickHandler(val)}
            />
        </>
    )
}

export default SortComponent;