import React from 'react';
import Pagination from 'rc-pagination';
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

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
                nextIcon={<GrFormNext size={20} />}
                prevIcon={<GrFormPrevious size={20} />}
            />
        </>
    )
}

export default Paginate
