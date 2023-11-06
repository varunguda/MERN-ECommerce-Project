import React, { useEffect } from 'react';
import "./Dashboard.css";
import { PiShirtFoldedLight } from 'react-icons/pi';
import { HiOutlineUsers } from 'react-icons/hi2';
import { BsBoxSeam } from 'react-icons/bs';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { getDataAnalysis } from '../../../State/action-creators/AdminActionCreators';
import { Link } from 'react-router-dom';
Chart.register(CategoryScale);


const Dashboard = () => {

    const { fetchingAnalysis, fetchedAnalysis, analysis } = useSelector(state => state.adminAnalytics);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDataAnalysis());
    }, [dispatch]);

    useEffect(() => {
        if (fetchingAnalysis) {
            dispatch(loaderSpin(true));
        } else {
            dispatch(loaderSpin(false));
        }
        // eslint-disable-next-line
    }, [fetchingAnalysis]);


    const incomeGeneratedData = {
        labels: analysis && Object.keys(analysis.income_generated),
        datasets: [
            {
                label: 'INCOME GENERATED (INR)',
                data: analysis && Object.values(analysis.income_generated),
                fill: false,
                backgroundColor: '#32CD32',
                borderColor: '#32CD326f',
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
        labels: analysis && Object.keys(analysis.orders_placed),
        datasets: [
            {
                label: 'ORDERS PLACED',
                data: analysis && Object.values(analysis.orders_placed),
                fill: false,
                backgroundColor: '#0071dc',
                borderColor: '#0071dc6f',
            },
            {
                label: 'ORDERS CANCELLED',
                data: analysis && Object.values(analysis.orders_cancelled),
                fill: false,
                backgroundColor: '#ffc220',
                borderColor: '#ffc2206f',
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
        labels: analysis && Object.keys(analysis.users_registered),
        datasets: [
            {
                label: 'USERS REGISTERED',
                data: analysis && Object.values(analysis.users_registered),
                fill: false,
                backgroundColor: '#0071dc',
                borderColor: '#0071dc6f',
            },
            {
                label: 'SELLERS REGISTERED',
                data: analysis && Object.keys(analysis.sellers_registered),
                fill: false,
                backgroundColor: '#ffc220',
                borderColor: '#ffc2206f',
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
        labels: ['CUSTOMERS', 'SELLERS'],
        datasets: [
            {
                data: [analysis && analysis.total_customers, analysis && analysis.total_sellers],
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
                data: [analysis && analysis.total_users_count, analysis && analysis.total_deleted_users_count],
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
        labels: analysis && Object.keys(analysis.products_analysis),
        datasets: [
            {
                label: 'IN STOCK',
                data: analysis && Object.keys(analysis.products_analysis).map((category) => {return analysis.products_analysis[category].in_stock}),
                backgroundColor: '#0071dc',
                borderColor: '#0071dc2f',
            },
            {
                label: 'OUT OF STOCK',
                data: analysis && Object.keys(analysis.products_analysis).map((category) => {return analysis.products_analysis[category].out_of_stock}),
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

        (fetchedAnalysis && analysis && Object.keys(analysis).length > 0) && (

            <div className="profile-page-content">

                <div className="page-head">Dashboard</div>

                <div className="dashboard-container">

                    <div className="head-templates">
                        <Link to="/admin/products/all" className='link template'>
                            <div>
                                Products
                                <span className={analysis.total_products_count < 20 ? "red" : analysis.total_products_count > 200 ? "green" : "" }>
                                    {analysis.total_products_count}
                                </span>
                            </div>

                            <div className="icon">
                                <PiShirtFoldedLight size={30} />
                            </div>
                        </Link>

                        <Link to="/admin/orders/all" className='link template'>
                            <div>
                                Orders
                                <span className={analysis.total_orders_count < 20 ? "red" : analysis.total_orders_count > 100 ? "green" : "" }>
                                    {analysis.total_orders_count}
                                </span>
                            </div>

                            <div className="icon">
                                <BsBoxSeam size={25} />
                            </div>
                        </Link>

                        <Link to="/admin/customers" className='link template'>
                            <div>
                                Users
                                <span className={analysis.total_users_count < 20 ? "red" : analysis.total_users_count > 200 ? "green" : "" }>
                                    {analysis.total_users_count}
                                </span>
                            </div>

                            <div className="icon">
                                <HiOutlineUsers size={25} strokeWidth={1.5} />
                            </div>
                        </Link>
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
    )
}

export default Dashboard;
