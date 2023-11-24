import React, { useContext, useEffect, useState } from 'react';
import "./Product.css";
import Table from '../../elements/Table/Table';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../State/action-creators/ProductActionCreators';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { setAvailability, setPage } from '../../../State/action-creators/NavigationActionCreators';
import IconTrash from '@tabler/icons-react/dist/esm/icons/IconTrash';
import IconEdit from '@tabler/icons-react/dist/esm/icons/IconEdit';
import IconExternalLink from '@tabler/icons-react/dist/esm/icons/IconExternalLink';
import { useMutation } from 'react-query';
import { deleteAnyProduct, editAnyProductDetails } from '../fetchers';
import { toast } from 'react-toastify';
import EditProductForm from '../../layouts/ProductLayouts/EditProductForm';
import { ModalContext } from '../../../Context/ModalContext';


const AllProducts = () => {

    const { openModal, closeModal } = useContext(ModalContext);

    const { loading, products, productCount } = useSelector(state => state.products);
    const deleteProductMutation = useMutation(deleteAnyProduct);
    const editProductMutation = useMutation(editAnyProductDetails);

    const [ pageNum, setPageNum ] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch({ type: "RESET_FACETS" });
        }
        // eslint-disable-next-line 
    }, []);

    const fetchProducts = () => {
        dispatch(setPage(pageNum));
        dispatch(setAvailability("oos"));
        dispatch(getProducts());
    }

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line 
    }, [pageNum]);

    useEffect(() => {
        if (editProductMutation.isError || deleteProductMutation.isError) {
            toast.error(((editProductMutation.error && editProductMutation.error.message) || (deleteProductMutation.error && deleteProductMutation.error.message)), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            editProductMutation.reset();
            deleteProductMutation.reset();
        }
        // eslint-disable-next-line
    }, [editProductMutation.isError, deleteProductMutation.isError]);

    useEffect(() => {
        if(loading || editProductMutation.isLoading || deleteProductMutation.isLoading){
            dispatch(loaderSpin(true));
        }
        else{
            dispatch(loaderSpin(false));
        }
        // eslint-disable-next-line
    }, [loading, editProductMutation.isLoading, deleteProductMutation.isLoading]);

    useEffect(() => {
        if(editProductMutation.isSuccess || deleteProductMutation.isSuccess){
            toast.success(((editProductMutation.data && editProductMutation.data.message) || (deleteProductMutation.data && deleteProductMutation.data.message)), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            editProductMutation.reset();
            deleteProductMutation.reset();
            fetchProducts();
        }
        // eslint-disable-next-line
    }, [editProductMutation.isSuccess, deleteProductMutation.isSuccess]);


    const editHandler = (product, updatedData) => {
        editProductMutation.mutate({ product, updatedData });
        closeModal();
    }

    const editPorductHandler = (product_id) => {
        const product = products.find(prod => prod._id === product_id);
        openModal(
            "Edit Product Details",
            <EditProductForm product={product} updateProduct={(updatedData) => editHandler(product_id, updatedData)} />
        );
    }

    const deleteClickHandler = (product) => {
        deleteProductMutation.mutate({ product });
        closeModal();
    };

    const deleteProductHandler = (product) => {
        openModal(
            "Are you sure you want to delete this product permanently?",
            <>
                <div className="modal-caption">
                    This product will no longer be available on ManyIN from now and product will be cancelled from all the Orders if the product status is 'Processing'.
                </div>

                <div className="modal-btn-container">
                    <button type="button" onClick={closeModal} className='secondary-btn'>No</button>
                    <button
                        type="button"
                        onClick={() => deleteClickHandler(product)}
                        className='main-btn warning'
                    >
                        Yes
                    </button>
                </div>
            </>
        )
    };

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
            flex: 0.3
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number',
            minWidth: 90,
            flex: 0.25,
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
            flex: 0.25,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <div className="table-icons-container">
                        <span onClick={() => editPorductHandler(params.row._id)}>
                            <IconEdit size={18} strokeWidth={1.25} />
                        </span>
                        <span onClick={() => deleteProductHandler(params.row._id)}>
                            <IconTrash strokeWidth={1.25} size={18} />
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
            <div className="page-head">Products</div>
            {(loading === false) && (
                <div className='all-products-container'>
                    <Table
                        rows={products} 
                        page={pageNum} 
                        getPage={setPageNum} 
                        productCount={productCount} 
                        columns={columns} 
                        placeholderRows={placeholderRows}
                    />
                </div>
            )}
        </div>
    )
}

export default AllProducts;


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
