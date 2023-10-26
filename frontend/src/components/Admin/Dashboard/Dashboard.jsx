import React from 'react';
import "./Dashboard.css";
import { PiShirtFoldedLight } from 'react-icons/pi';
import { HiOutlineUsers } from 'react-icons/hi2';
import { BsBoxSeam } from 'react-icons/bs';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);


const Dashboard = () => {

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'ORDERS',
                data: [12, 19, 3, 5, 2, 3],
                fill: false,
                backgroundColor: '#0071dc',
                borderColor: '#0071dc2f',
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },

        plugins: {
            tooltip: {
                backgroundColor: 'white',
                displayColors: false,
                borderColor: 'gainsboro',
                borderWidth: 1,
                caretPadding: 10,
                bodyColor: "#46474a",
                titleColor: "#46474a",
            },
        },
    };

    return (
        <div className="profile-page-content">

            <div className="page-head">Dashboard</div>

            <div className="dashboard-container">

                <div className="head-templates">
                    <div>
                        <div>
                            Products
                            <span className='red'>12</span>
                        </div>

                        <div className="icon">
                            <PiShirtFoldedLight size={30} />
                        </div>
                    </div>

                    <div>
                        <div>
                            Orders
                            <span className='green'>201</span>
                        </div>

                        <div className="icon">
                            <BsBoxSeam size={25} />
                        </div>
                    </div>

                    <div>
                        <div>
                            Users
                            <span>3392</span>
                        </div>

                        <div className="icon">
                            <HiOutlineUsers size={25} strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                <div className="graphs-container">
                    <Line data={data} options={options} />
                </div>

            </div>
        </div>
    )
}

export default Dashboard
