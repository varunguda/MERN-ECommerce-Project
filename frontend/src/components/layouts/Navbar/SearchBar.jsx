import React, { useState } from 'react'
import { TfiSearch } from 'react-icons/tfi';

const SearchBar = () => {

    const [ keyword, setKeyword ] = useState("");

    const handleSearchHandler = (e) => {
        
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
