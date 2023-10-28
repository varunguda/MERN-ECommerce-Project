import * as React from 'react';
import "./Table.css";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineExport } from "react-icons/ai"


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



const Table = ({ products, getPage, page, productCount }) => {

    const [columnVisibility, setColumnVisibility] = React.useState({
        category: true,
        _id: false,
    });

    const handleColumnVisibilityChange = (newState) => {
        if (newState.category === false && columnVisibility.category === true) {
            setColumnVisibility({ category: false, _id: true });
        } else if (newState._id === false && columnVisibility._id === true) {
            setColumnVisibility({ category: true, _id: false });
        } else {
            setColumnVisibility(newState);
        }
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
                        <span><AiOutlineEdit size={18} /></span>
                        <span><AiOutlineDelete size={18} /></span>
                        <span onClick={() => window.open(`/product/${params.row._id}`)}>
                            <AiOutlineExport size={18} />
                        </span>
                    </div>
                )
            }
        },
    ];

    const rows = (num) => {
        let newPlaceholderRows = [];
        for(let i = 0; i < num; i++){
            newPlaceholderRows = newPlaceholderRows.concat(placeholderRows);
        }
        return newPlaceholderRows;
    }


    return (
        <div className="data-grid-container">
            <Box sx={{ height: 630, width: '100%', color: "#46474a" }}>
                <DataGrid
                    rows={rows(page - 1).concat(products)}
                    rowCount={productCount}
                    columns={columns}
                    getRowId={row => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                                page: page - 1,
                            },
                        }
                    }}
                    columnVisibilityModel={columnVisibility}
                    onColumnVisibilityModelChange={handleColumnVisibilityChange}
                    pageSizeOptions={[10]}
                    rowSelection={false}
                    onPaginationModelChange={(val) => getPage(val.page + 1)}
                />
            </Box>
        </div>
    );
}

export default Table
