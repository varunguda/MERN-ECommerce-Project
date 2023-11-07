import React, { useEffect, useRef, useState } from 'react'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux';
import { toggleListItem } from '../../../State/action-creators/UserActionCreators';


const ListHeartButton = ({ product, size }) => {

    const { listItemsLoading, listItems } = useSelector(state => state.listItems);

    const [added, setAdded] = useState(false);
    const listInterval = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (listItems && listItems.some((prod) => prod.toString() === product)) {
            setAdded(true);
        } else if (listItems && !listItems.some((prod) => prod.toString() === product)) {
            setAdded(false);
        }
        // eslint-disable-next-line
    }, [listItems, product]);


    const addToListHandler = () => {
        setAdded(!added);

        clearTimeout(listInterval.current);
        listInterval.current = setTimeout(() => {
            dispatch(toggleListItem(product));
        }, 700);
    }

    return (
        ( !listItemsLoading && added) ? (
            <>
                <HiHeart onClick={addToListHandler} strokeWidth={1} size={size ? size : 20} color="#e31b23" />
            </>
        ) : (
            <>
                <HiOutlineHeart onClick={addToListHandler} strokeWidth={1} size={size ? size : 20} />
            </>
        )
    )
}

export default ListHeartButton;