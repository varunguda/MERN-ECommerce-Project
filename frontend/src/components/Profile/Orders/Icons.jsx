import React from 'react';
import IconOutForDelivery from '@tabler/icons-react/dist/esm/icons/IconPackageImport';
import IconPackage from '@tabler/icons-react/dist/esm/icons/IconPackage';
import IconX from '@tabler/icons-react/dist/esm/icons/IconX';
import IconCheck from '@tabler/icons-react/dist/esm/icons/IconCheck';
import IconWarehouse from '@tabler/icons-react/dist/esm/icons/IconBuildingWarehouse';
import IconTruckDelivery from '@tabler/icons-react/dist/esm/icons/IconTruckDelivery';
import IconPackageCancelled from '@tabler/icons-react/dist/esm/icons/IconPackageOff';
import IconHourGlassHigh from '@tabler/icons-react/dist/esm/icons/IconHourglassHigh';
import IconHourGlass from '@tabler/icons-react/dist/esm/icons/IconHourglass';
import IconHourGlassLow from '@tabler/icons-react/dist/esm/icons/IconHourglassLow';


const Icons = ({ status }) => {
    return (
        <div className="order-icon">
            <div className="main-icon">

                {(status === "Processing") ? (
                    <IconPackage size={24} className="icon" strokeWidth={1.25} />
                ) : (
                    (status === "Shipped") ? (
                        <IconWarehouse size={24} className="icon" strokeWidth={1.25} />
                    ) : (
                        (status === "In transit") ? (
                            <IconTruckDelivery strokeWidth={1.25} size={24} className="icon" />
                        ) : (
                            (status === "Out for delivery") ? (
                                <IconOutForDelivery size={24} className="icon" strokeWidth={1.25} style={{transform: "scaleX(-1)" }}/>
                            ) : (
                                (status === "Cancelled") ? (
                                    <IconPackageCancelled size={24} strokeWidth={1.25} className="icon" style={{transform: "scaleX(-1)" }} />
                                ) : (
                                    <IconPackage size={24} className="icon" strokeWidth={1.25} />
                                )
                            )
                        )
                    )
                )}
            </div>

            <div className={`status-icon ${(status !== "Delivered") ? ((status !== "Cancelled") ? "orange" : "red") : "green"}`}>
                {(status === "Delivered") ? (
                    <IconCheck size={14} className="icon" strokeWidth={2} />
                ) : (
                    (status === "Cancelled") ? (
                        <IconX size={14} className="icon" strokeWidth={2} />
                    ) : (status === "Shipped") ? (
                        <IconHourGlassHigh size={14} className="icon" strokeWidth={1.5} />
                    ) : (status === "In transit") ? (
                        <IconHourGlass size={14} className="icon" strokeWidth={1.5} />
                    ) : (status === "Out for delivery") ? (
                        <IconHourGlassLow size={14} className="icon" strokeWidth={1.5} />
                    ) : (
                        <IconHourGlassHigh size={14} className='icon' strokeWidth={1.5} />
                    )
                )}
            </div>
        </div>
    )
}

export default Icons
