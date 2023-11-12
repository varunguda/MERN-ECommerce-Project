import React from 'react';
import Pagination from 'rc-pagination';
import IconChevronRight from '@tabler/icons-react/dist/esm/icons/IconChevronRight';
import IconChevronLeft from '@tabler/icons-react/dist/esm/icons/IconChevronLeft';


import "./Paginate.css";

const Paginate = ({ onChange, total, pageSize, current }) => {
    return (
        <>
            <Pagination
                className="pagination-data"
                onChange={onChange}
                total={total}
                pageSize={pageSize}
                current={current}
                nextIcon={<IconChevronRight strokeWidth={1.5} size={20} />}
                prevIcon={<IconChevronLeft strokeWidth={1.5} size={20} />}
            />
        </>
    )
}

export default Paginate
