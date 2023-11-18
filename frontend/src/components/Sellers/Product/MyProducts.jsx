import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from "react-query";
import { cancelAllProductOrders, fetchMyProducts } from '../fetchers';
import { useDispatch } from 'react-redux';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { toast } from 'react-toastify';
import { ModalContext } from '../../../Context/ModalContext';
import Table from '../../elements/Table/Table';
import IconTrash from '@tabler/icons-react/dist/esm/icons/IconTrash';
import IconEdit from '@tabler/icons-react/dist/esm/icons/IconEdit';
import IconExternalLink from '@tabler/icons-react/dist/esm/icons/IconExternalLink';
import IconShirtOff from '@tabler/icons-react/dist/esm/icons/IconShirtOff';
import { JustificationModalContent } from '../Order/ProductOrders';


const MyProducts = () => {

    const { openModal, closeModal, setModalContent, setModalHeading } = useContext(ModalContext);

    const [pageNum, setPageNum] = useState(1);
    const { data, error, isLoading, refetch } = useQuery(["my products", pageNum], fetchMyProducts);
    const cancelMutation = useMutation(cancelAllProductOrders);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isLoading || cancelMutation.isLoading) {
            dispatch(loaderSpin(true));
        } else {
            dispatch(loaderSpin(false));
        }
        // eslint-disable-next-line
    }, [isLoading, cancelMutation.isLoading]);

    useEffect(() => {
        if (!!error || cancelMutation.isError) {
            toast.error((error.message || cancelMutation.error.message), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            cancelMutation.reset();
            refetch();
        }
        // eslint-disable-next-line
    }, [error, cancelMutation.isError]);

    useEffect(() => {
        if(cancelMutation.isSuccess){
            toast.success(cancelMutation.data.message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            cancelMutation.reset();
            refetch();
        }
        // eslint-disable-next-line
    }, [cancelMutation.isSuccess]);


    const cancelClickHandler = (product) => {
        setModalHeading("Justification");
        setModalContent(
            <JustificationModalContent
                cancelOrderHandler={(justification) => cancelMutation.mutate({ product, justification })}
            />
        );
    };

    const cancelProductOrdersHandler = (product) => {
        openModal(
            "Cancel all the orders of this product!",
            <>
                <div className="modal-caption">
                    This option cancels this specific product from all the processing orders. We recommend using this option if you're facing stock shortages. However, keep in mind that canceling orders may significantly impact your merit based on the number of orders cancelled.
                </div>

                <div className="modal-btn-container">
                    <button type="button" onClick={closeModal} className='secondary-btn'>No</button>
                    <button
                        type="button"
                        onClick={() => cancelClickHandler(product)}
                        className='main-btn warning'
                    >
                        Yes, Continue
                    </button>
                </div>
            </>
        )
    }

    const columns = [
        {
            field: '_id',
            headerName: 'Product ID',
            minWidth: 220,
            sortable: false,
            flex: 0.5,
            hide: true,
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 150,
            flex: 0.5
        },
        {
            field: 'category',
            headerName: 'Department',
            minWidth: 130,
            flex: 0.25
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number',
            minWidth: 90,
            flex: 0.2,
            cellClassName: (params) => {
                return (params.row.stock === 0) ? "red-color" : (params.row.stock < 100) && "orange-color";
            }
        },
        {
            field: 'final_price',
            headerName: 'Final Price',
            type: 'number',
            minWidth: 100,
            flex: 0.25,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 50,
            flex: 0.35,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <div className="table-icons-container">
                        <span><IconEdit size={18} strokeWidth={1.25} /></span>
                        <span><IconTrash strokeWidth={1.25} size={18} /></span>
                        <span onClick={() => cancelProductOrdersHandler(params.row._id)}>
                            <IconShirtOff strokeWidth={1.25} size={18} />
                        </span>
                        <span onClick={() => window.open(`/product/${params.row._id}`)}>
                            <IconExternalLink size={18} strokeWidth={1.25} />
                        </span>
                    </div>
                )
            }
        },
    ];


    return (
        <div className="profile-page-content">
            <div className="page-head">My Products</div>
            {(!isLoading && !!data) && (
                <div className='all-products-container'>
                    <Table
                        rows={data.products}
                        page={pageNum}
                        getPage={setPageNum}
                        productCount={data.product_count}
                        columns={columns}
                        placeholderRows={placeholderRows}
                    />
                </div>
            )}
        </div>
    )
}

export default MyProducts;



const placeholderRows = [
    {
        _id: '1',
        name: 'Product 1',
        stock: 75,
        final_price: 19.99,
    },
    {
        _id: '2',
        name: 'Product 2',
        stock: 150,
        final_price: 29.99,
    },
    {
        _id: '3',
        name: 'Product 3',
        stock: 0,
        final_price: 9.99,
    },
    {
        _id: '4',
        name: 'Product 4',
        stock: 50,
        final_price: 14.99,
    },
    {
        _id: '5',
        name: 'Product 5',
        stock: 200,
        final_price: 39.99,
    },
    {
        _id: '6',
        name: 'Product 6',
        stock: 90,
        final_price: 24.99,
    },
    {
        _id: '7',
        name: 'Product 7',
        stock: 110,
        final_price: 32.99,
    },
    {
        _id: '8',
        name: 'Product 8',
        stock: 75,
        final_price: 19.99,
    },
    {
        _id: '9',
        name: 'Product 9',
        stock: 15,
        final_price: 7.99,
    },
    {
        _id: '10',
        name: 'Product 10',
        stock: 30,
        final_price: 11.99,
    },
];

