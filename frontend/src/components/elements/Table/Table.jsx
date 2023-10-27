import * as React from 'react';
import "./Table.css";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import {AiOutlineDelete, AiOutlineEdit, AiOutlineExport} from "react-icons/ai"  


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
            minWidth: 150,
            flex: 0.3
        },
        {
            field: 'stock',
            headerName: 'Stock',
            type: 'number',
            minWidth: 110,
            flex: 0.25,
            cellClassName: (params) => {
                return (params.row.stock === 0) ? "red-color" : (params.row.stock < 100) && "orange-color";
            }
        },
        {
            field: 'final_price',
            headerName: 'Final Price',
            type: 'number',
            minWidth: 110,
            flex: 0.25,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 50,
            flex: 0.3,
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


    return (
        <div className="data-grid-container">
            <Box sx={{ height: 630, width: '100%', color: "#46474a" }}>
                <DataGrid
                    rows={products}
                    rowCount={productCount}
                    columns={columns}
                    getRowId={row => row._id}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                                page: page-1,
                            },
                        },
                        columns: {
                            columnVisibilityModel: {
                                _id: false,
                            }
                        }
                    }}
                    columnVisibilityModel={columnVisibility}
                    onColumnVisibilityModelChange={handleColumnVisibilityChange}
                    pageSizeOptions={[10]}
                    rowSelection={false}
                    onPaginationModelChange={(val)=> getPage(val.page + 1)}
                />
            </Box>
        </div>
    );
}

export default Table
