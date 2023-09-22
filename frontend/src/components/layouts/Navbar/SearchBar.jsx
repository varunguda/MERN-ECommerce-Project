import React, { useState } from 'react'
import { TfiSearch } from 'react-icons/tfi';
import { useNavigate } from 'react-router';

const SearchBar = () => {

    const [ keyword, setKeyword ] = useState("");

    const navigate = useNavigate();

    const handleSearchHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products?keyword=${keyword}`);
        }
    }

    return (
        <form onSubmit={handleSearchHandler} className='searchbar-container'>
            <input
                type="text"
                className="search"
                id="search"
                spellCheck="false"
                placeholder="Search anything here..."
                onChange={(e)=>{
                    setKeyword(e.target.value)
                }}
            />

            <button type="submit" className="search-toggle" >
                <TfiSearch color='black' size={"22px"} />
            </button>
        </form>
    )
}

export default SearchBar
