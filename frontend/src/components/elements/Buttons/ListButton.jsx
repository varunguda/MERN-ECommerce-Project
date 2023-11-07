import React, { useEffect, useRef, useState } from 'react'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux';
import { toggleListItem } from '../../../State/action-creators/UserActionCreators';


const ListButton = ({ product }) => {

    const { listItemsLoading, listItems } = useSelector(state => state.listItems);

    const [added, setAdded] = useState(false);
    const listInterval = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if(listItems && listItems.some((prod) => prod.toString() === product)){
            setAdded(true);
        }else{
            setAdded(false);
        }
        // eslint-disable-next-line
    }, [listItems, product]);

    const addToListHandler = () => {
        setAdded(!added);

        clearTimeout(listInterval.current);
        listInterval.current = setTimeout(() => {
            dispatch(toggleListItem(product));
        }, 1000);
    }

    return (
        <>
            { !listItemsLoading && (
            <button className='inferior-btn' onClick={addToListHandler}>
                {added ? (
                    <>
                        <HiHeart size={20} color="#e31b23" />Visit List
                    </>
                ) : (
                    <>
                        <HiOutlineHeart size={20} />Add to list
                    </>
                )}
            </button>
            )}
        </>
    )
}

export default ListButton;
