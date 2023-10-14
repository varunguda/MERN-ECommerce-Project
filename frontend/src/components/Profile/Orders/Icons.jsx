import React from 'react';
import { BsBox2Heart, BsBoxSeam, BsCheck } from "react-icons/bs";
import { LuClock4, LuPackageX } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { PiArchiveBoxLight, PiWarehouseLight } from 'react-icons/pi';
import { RxCross2 } from 'react-icons/rx';


const Icons = ({ status }) => {
    return (
        <div className="order-icon">

            <div className="main-icon">
                {(status === "Processing") ? (
                    <PiArchiveBoxLight size={23} className="icon" />
                ) : (
                    (status === "Shipped") ? (
                        <PiWarehouseLight size={23} className="icon" />
                    ) : (
                        (status === "In-transit") ? (
                            <TbTruckDelivery strokeWidth={1} size={23} className="icon" />
                        ) : (
                            (status === "Out for delivery") ? (
                                <BsBox2Heart size={19} className="icon" />
                            ) : (
                                (status === "Cancelled") ? (
                                    <LuPackageX size={23} strokeWidth={1} className="icon" style={{transform: "scaleX(-1)" }} />
                                ) : (
                                    <BsBoxSeam size={19} className="icon" />
                                )
                            )
                        )
                    )
                )}
            </div>

            <div className={`status-icon ${(status !== "Delivered") ? ((status !== "Cancelled") ? "orange" : "red") : "green"}`}>
                {(status === "Delivered") ? (
                    <BsCheck size={20} className="icon" />
                ) : (
                    (status === "Cancelled") ? (
                        <RxCross2 size={14} className="icon" />
                    ) : (
                        <LuClock4 size={13} className='icon' />
                    )
                )}
            </div>
        </div>
    )
}

export default Icons
