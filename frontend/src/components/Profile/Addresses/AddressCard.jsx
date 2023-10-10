import React from 'react'

const AddressCard = ({ address, editClickHandler, removeClickHandler }) => {

    return (
        <div className='address-card-container'>

            <div className="section1">
                <div className="light-text">
                    {address.first_name + " " + address.last_name}
                </div>

                <div className="address">
                    {`${address.flat}, ${address.street_address}, ${address.city}, ${address.state}, ${address.zip}`}
                </div>

                {address.default_address && (
                    <div className="light-text">
                        Preferred delivery address
                    </div>
                )}
            </div>

            <div className="section2">
                <button 
                    className="inferior-btn" 
                    style={{ fontSize: "0.9rem" }}
                    onClick={() => editClickHandler(address._id)}
                >
                    Edit
                </button>

                <button 
                    className="inferior-btn" 
                    style={{ fontSize: "0.9rem" }}
                    onClick={() => removeClickHandler(address._id)}
                >
                    Remove
                </button>
            </div>
        </div>
    )
}

export default AddressCard
