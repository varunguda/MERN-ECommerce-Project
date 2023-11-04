import * as React from 'react';
import "./Table.css";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';


const Table = ({ rows, getPage, page, productCount, columns, placeholderRows }) => {

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

    const rowsFn = (num) => {
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
                    rows={rowsFn(page - 1).concat(rows)}
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
