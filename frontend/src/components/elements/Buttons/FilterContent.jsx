import React, { useContext, useState } from 'react';
import { ModalContext } from '../../../Context/ModalContext';

const allStatus = {
    "all": "All",
    "delivered": "Delivered",
    "outForDelivery": "Out for delivery",
    "inTransit": "In transit",
    "shipped": "Shipped",
    "processing": "Processing",
    "cancelled": "Cancelled",
}

const allTimes = {
    "any": "Anytime",
    "last30days": "Last 30 days",
    "last6months": "Last 6 months",
    "last1year": "Last year",
    "before1year": "Before an year",
}

const FilterContent = ({ state, setStatus, setTime, setNavigateUrl }) => {

    const { closeModal } = useContext(ModalContext);

    const [ selectedStatus, setSelectedStatus ] = useState(state.status ? state.status : "all");
    const [ selectedTime, setSelectedTime ] = useState(state.time ? state.time : "any");
    

    const statusClickHandler = (e) => {
        if(e.target.name === "all"){
            setSelectedStatus("all");
        }
        else if(e.target.name !== selectedStatus){
            setSelectedStatus(e.target.name);
        }
    }

    const timeClickHandler = (e) => {
        if(e.target.name === "any"){
            setSelectedTime("any");
        }
        else if(e.target.name !== selectedTime){
            setSelectedTime(e.target.name);
        }
    }

    const clearFiltersHandler = () => {
        setTime("");
        setStatus("");
        setSelectedStatus("all");
        setSelectedTime("any");
    }

    const applyFilters = (e) => {
        e.preventDefault();

        if((state.status !== selectedStatus) || (state.time !== selectedTime)){
            setStatus(selectedStatus === "all" ? "" : selectedStatus);
            setTime(selectedTime === "any" ? "" : selectedTime);
            setNavigateUrl(true);
        }

        closeModal();
    }


    return (
        <form onSubmit={applyFilters} className='orders-filters-container'>

            <div className="filters-container">

                <div className="status-filter filter-section">

                    <div className="filter-heading">Status</div>

                    {Object.keys(allStatus).map((status, index) => {
                        return (
                            <div key={index} className="checkboxes">
                                <input
                                    type="checkbox"
                                    onClick={statusClickHandler}
                                    checked={selectedStatus === status ? true : false}
                                    name={status}
                                    id={status}
                                    readOnly
                                />
                                <label htmlFor={status}>{allStatus[status]}</label>
                            </div>
                        )
                    })}

                </div>


                <div className="time-filter filter-section">

                    <div className="filter-heading">Time</div>

                    {Object.keys(allTimes).map((time, index) => {
                        return (
                            <div key={index} className="checkboxes">
                                <input
                                    type="checkbox"
                                    onClick={timeClickHandler}
                                    checked={selectedTime === time ? true : false}
                                    name={time}
                                    id={time}
                                    readOnly
                                />
                                <label htmlFor={time}>{ allTimes[time] }</label>
                            </div>
                        );
                    })}

                </div>

            </div>

            <div className="modal-btn-container">
                <button onClick={clearFiltersHandler} className='secondary-btn' type="button">Clear filters</button>
                <button className='main-btn' type="submit">Apply filters</button>
            </div>

        </form>
    )
}

export default FilterContent
