import React from 'react'
import "./FilterContent.css";

const allStatus = {
    "": "All",
    "delivered": "Delivered",
    "outForDelivery": "Out for delivery",
    "inTransit": "In transit",
    "shipped": "Shipped",
    "processing": "Processing",
    "cancelled": "Cancelled",
}

const allTimes = {
    "": "Anytime",
    "last30days": "Last 30 days",
    "last6months": "Last 6 months",
    "last1year": "Last year",
    "before1year": "Before an year",
}

const FilterContent = ({ selectedStatus, selectedTime }) => {

    return (
        <form className='orders-filters-container'>

            <div className="filters-container">

                <div className="status-filter filter-section">

                    <div className="filter-heading">Status</div>

                    {Object.keys(allStatus).map((status, index) => {
                        return (
                            <div key={index} className="checkboxes">
                                <input
                                    type="checkbox"
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
                <button className='secondary-btn' type="button">Clear filters</button>
                <button className='main-btn' type="submit">Apply filters</button>
            </div>

        </form>
    )
}

export default FilterContent
