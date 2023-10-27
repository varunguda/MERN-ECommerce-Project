import React from 'react';
import "./Dashboard.css";
import { PiShirtFoldedLight } from 'react-icons/pi';
import { HiOutlineUsers } from 'react-icons/hi2';
import { BsBoxSeam } from 'react-icons/bs';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);


const Dashboard = () => {

    const incomeGeneratedData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'INCOME GENERATED (INR)',
                data: [212033, 324234, 64721, 24633, 43532, 10635],
                fill: false,
                backgroundColor: '#32CD32',
                borderColor: '#32CD322f',
            },
        ],
    };

    const incomeGeneratedOptions = {
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

        devicePixelRatio: 3
    };


    const ordersPlacedData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'ORDERS PLACED',
                data: [12, 19, 3, 5, 2, 3],
                fill: false,
                backgroundColor: '#0071dc',
                borderColor: '#0071dc2f',
            },
        ],
    };

    const ordersPlacedOptions = {
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

        devicePixelRatio: 3
    };


    const usersRegisteredData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'USERS REGISTERED',
                data: [123, 239, 432, 97, 34, 21],
                fill: false,
                backgroundColor: '#0071dc',
                borderColor: '#0071dc2f',
            },
            {
                label: 'SELLERS REGISTERED',
                data: [13, 29, 32, 7, 24, 31],
                fill: false,
                backgroundColor: '#ffc220',
                borderColor: '#ffc2202f',
            },
        ],
    };

    const usersRegisteredOptions = {
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

        devicePixelRatio: 3
    };

    const usersVsSellersData = {
        labels: ['BUYERS', 'SELLERS'],
        datasets: [
            {
                data: [3000, 500],
                backgroundColor: ['#0071dc', '#ffc220'],
                hoverOffset: 4
            }
        ]
    };

    const usersVsSellersOptions = {
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

        devicePixelRatio: 2,
    };


    const activeVsDeletedUsersData = {
        labels: ['ACTIVE USERS', 'DELETED USERS'],
        datasets: [
            {
                data: [3000, 100],
                backgroundColor: ['#0071dc', '#ffc220'],
                hoverOffset: 4
            }
        ]
    };

    const activeVsDeletedUsersOptions = {
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

        devicePixelRatio: 2,
    };


    const barChartData = {
        labels: [
            "Mobile Phone",
            "Laptop",
            "Computer",
            "Monitor",
            "Clothing",
            "Shoes",
            "Watches",
            "Television",
            "Refrigerator",
            "Accessories",
            "Beauty",
            "Headphones"
        ],
        datasets: [
            {
                label: 'IN STOCK',
                data: [12, 19, 3, 5, 2, 3, 12, 15, 8, 9, 7, 13],
                backgroundColor: '#0071dc',
                borderColor: '#0071dc2f',
            },
            {
                label: 'OUT OF STOCK',
                data: [4, 1, 0, 2, 0, 2, 1, 3, 2, 1, 1, 2],
                backgroundColor: '#ffc220',
                borderColor: '#ffc2202f',
            },
        ],
    };

    const barChartOptions = {
        scales: {
            y: {
                stacked: true,
                beginAtZero: true,
            },
            x: {
                stacked: true,
            },
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

        devicePixelRatio: 3
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

                <div className="graphs-charts-container">
                    <div className="graph">
                        <Line data={incomeGeneratedData} options={incomeGeneratedOptions} />
                    </div>
                    <div className="graph">
                        <Line data={ordersPlacedData} options={ordersPlacedOptions} />
                    </div>
                    <div className="graph">
                        <Line data={usersRegisteredData} options={usersRegisteredOptions} />
                    </div>

                    <div className="graph">
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>

                    <div className="chart-grid">
                        <div className="chart">
                            <Doughnut data={usersVsSellersData} options={usersVsSellersOptions} />
                        </div>
                        <div className="chart">
                            <Doughnut data={activeVsDeletedUsersData} options={activeVsDeletedUsersOptions} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard;
