import React, { useContext } from 'react';
import "./OrderFilterButton.css";
import { ModalContext } from '../../../Context/ModalContext';
import IconFilterSearch from '@tabler/icons-react/dist/esm/icons/IconFilterSearch';
import FilterContent from './FilterContent';


const OrderFilterButton = ({ state, setStatus, setTime, setNavigateUrl }) => {

    const { openModal } = useContext(ModalContext);

    const filterClickHandler = () => {

        const modalContent = (
            <FilterContent
                state={state}
                setStatus={(val) => setStatus(val)}
                setTime={(val) => setTime(val)}
                setNavigateUrl={setNavigateUrl}
            />
        )

        openModal("Filter Orders", modalContent);
    }


    return (
        <button onClick={filterClickHandler} type='button' className="order-filter-btn">
            <IconFilterSearch size={15} strokeWidth={1.25} />
            Filters
        </button>
    )
}

export default OrderFilterButton
