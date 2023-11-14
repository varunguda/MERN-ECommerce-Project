import React, { useEffect } from 'react';
import "./Dashboard.css";
import IconDevices2 from '@tabler/icons-react/dist/esm/icons/IconDevices2';
import IconPackages from '@tabler/icons-react/dist/esm/icons/IconPackages';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { Link } from 'react-router-dom';
import { getSellerDataAnalysis } from '../../../State/action-creators/SellerActionCreators';
Chart.register(CategoryScale);


const Dashboard = ({user}) => {

    const { fetchingAnalysis, fetchedAnalysis, analysis } = useSelector(state => state.sellerAnalytics);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSellerDataAnalysis());
        // eslint-disable-next-line
    }, []);

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

                <div className="page-head">{`${user && user.name}'s Seller Dashboard`}</div>

                <div className="dashboard-container">

                    <div className="head-templates">
                        <Link to="/seller/products/all" className='link template'>
                            <div>
                                Products
                                <span className={analysis.total_products_count < 20 ? "red" : analysis.total_products_count > 200 ? "green" : "" }>
                                    {analysis.total_products_count}
                                </span>
                            </div>

                            <div className="icon">
                                <IconDevices2 size={30} strokeWidth={1.25} />
                            </div>
                        </Link>

                        <Link to="/seller/orders/all" className='link template'>
                            <div>
                                Orders
                                <span className={analysis.total_orders_count < 20 ? "red" : analysis.total_orders_count > 100 ? "green" : "" }>
                                    {analysis.total_orders_count}
                                </span>
                            </div>

                            <div className="icon">
                                <IconPackages size={30} strokeWidth={1} />
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
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>
                    </div>

                </div>
            </div>
        )
    )
}

export default Dashboard;
