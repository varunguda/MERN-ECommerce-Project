import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { deleteAnyuser, getAllSellers, updateUserRole } from '../../../State/action-creators/AdminActionCreators';
import IconTrash from '@tabler/icons-react/dist/esm/icons/IconTrash';
import IconEdit from '@tabler/icons-react/dist/esm/icons/IconEdit';
import Table from '../../elements/Table/Table';
import { ModalContext } from '../../../Context/ModalContext';
import { DELETE_USER_RESET, UPDATE_USER_ROLE_RESET } from '../../../State/constants/AdminConstants';
import { toast } from 'react-toastify';


const UpdateSellerRole = ({ closeModal, user, updateUserRole, dispatch }) => {

    const [userRoles, setUserRoles] = useState({
        is_admin: user.is_admin,
        is_seller: user.is_seller
    });

    const userRoleChangeHandler = (e) => {
        setUserRoles({ ...userRoles, [e.target.name]: e.target.checked });
    }

    return (
        <>
            <>
                <div className="checkboxes" style={{ marginBottom: "10px" }}>
                    <input
                        type="checkbox"
                        checked={userRoles.is_admin}
                        name="is_admin"
                        id="is_admin"
                        onChange={userRoleChangeHandler}
                    />
                    <label htmlFor="is_admin">Admin</label>
                </div>
                <div className="checkboxes">
                    <input
                        type="checkbox"
                        checked={userRoles.is_seller}
                        name="is_seller"
                        id="is_seller"
                        onChange={userRoleChangeHandler}
                    />
                    <label htmlFor="is_seller">Seller</label>
                </div>
            </>

            <div className="modal-btn-container">
                <button className="inferior-btn" onClick={closeModal}>Cancel</button>
                <button
                    className="main-btn"
                    onClick={() => {
                        if ((userRoles.is_admin !== user.is_admin) || (userRoles.is_seller !== user.is_seller)) {
                            dispatch(updateUserRole(user._id, userRoles.is_seller, userRoles.is_admin));
                        }
                        closeModal();
                    }}
                >
                    Save
                </button>
            </div>
        </>
    )
}


const AllSellers = () => {

    const { gettingAllUsers, totalUsersCount, users } = useSelector(state => state.customersOrSellers);
    const { deletingUser, deletedUser, deletedUserMessage, deletedUserError } = useSelector(state => state.deleteAnyUser);
    const { updatingUserRole, updatedUserRole, updatedUserRoleMessage, updatedUserRoleError } = useSelector(state => state.updateUserRole);

    const { openModal, closeModal } = useContext(ModalContext);

    const [pageNum, setPageNum] = useState(1);

    const dispatch = useDispatch();

    useEffect(() => {
        if ((deletedUser !== false) && (updatedUserRole !== false)) {
            dispatch({ type: DELETE_USER_RESET });
            dispatch({ type: UPDATE_USER_ROLE_RESET });
            dispatch(getAllSellers(pageNum));
        }
        // eslint-disable-next-line
    }, [pageNum, deletedUser, updatedUserRole]);


    useEffect(() => {
        toast.success((deletedUserMessage || updatedUserRoleMessage), {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [deletedUserMessage, updatedUserRoleMessage]);


    useEffect(() => {
        toast.error((deletedUserError || updatedUserRoleError), {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [deletedUserError, updatedUserRoleError]);


    useEffect(() => {
        if (gettingAllUsers || deletingUser || updatingUserRole) {
            dispatch(loaderSpin(true));
        }
        else {
            dispatch(loaderSpin(false));
        }
        // eslint-disable-next-line
    }, [gettingAllUsers, deletingUser, updatingUserRole]);


    const updateClickHandler = (id) => {
        const user = users.find((user) => user._id === id);
        openModal("Update user role", <UpdateSellerRole closeModal={closeModal} user={user} updateUserRole={updateUserRole} dispatch={dispatch} />);
    }


    const deleteClickHandler = (id) => {
        const modalContent = (
            <>
                <div className="modal-caption">
                    Once deleted, you will no longer be able to find this user on ManyIN anymore.
                </div>
                <div className="modal-btn-container">
                    <button className="secondary-btn" onClick={closeModal}>No</button>
                    <button
                        className="main-btn warning"
                        onClick={() => {
                            dispatch(deleteAnyuser(id));
                            closeModal();
                        }}
                    >
                        Yes
                    </button>
                </div>
            </>
        );
        openModal("Are you sure you want to delete this seller?", modalContent);
    }


    const columns = [
        {
            field: '_id',
            headerName: 'User ID',
            minWidth: 220,
            sortable: false,
            flex: 0.5,
            hide: true,
        },
        {
            field: 'name',
            headerName: 'Seller Name',
            minWidth: 120,
            flex: 0.3
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 150,
            flex: 0.5
        },
        {
            field: 'seller_merit',
            headerName: 'Seller Merit',
            minWidth: 70,
            flex: 0.2
        },
        {
            field: 'total_sales',
            headerName: 'Total Sales',
            minWidth: 70,
            flex: 0.2
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
                        <span onClick={() => updateClickHandler(params.row._id)}><IconEdit size={18} strokeWidth={1.25} /></span>
                        <span onClick={() => deleteClickHandler(params.row._id)}>
                            <IconTrash size={18} strokeWidth={1.25} />
                        </span>
                    </div>
                )
            }
        },
    ];


    return (
        <div className="profile-page-content">
            <div className="page-head">ManyIN Sellers</div>
            {((gettingAllUsers === false) && (deletingUser !== true)) && (
                <div className='all-products-container'>
                    <Table
                        rows={users}
                        page={pageNum}
                        getPage={setPageNum}
                        productCount={totalUsersCount}
                        columns={columns}
                        placeholderRows={placeholderRows}
                    />
                </div>
            )}
        </div>
    )
}

export default AllSellers;


const placeholderRows = [
    {
        _id: '1',
        name: 'Product 1',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '2',
        name: 'Product 2',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '3',
        name: 'Product 3',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '4',
        name: 'Product 4',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '5',
        name: 'Product 5',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '6',
        name: 'Product 6',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '7',
        name: 'Product 7',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '8',
        name: 'Product 8',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '9',
        name: 'Product 9',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
    {
        _id: '10',
        name: 'Product 10',
        email: "",
        seller_merit: 0,
        total_sales: 0,
    },
];