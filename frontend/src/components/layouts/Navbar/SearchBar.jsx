import React, { useRef, useState } from 'react'
import { TfiSearch } from 'react-icons/tfi';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { navigationActionCreators } from '../../../State/action-creators';

const SearchBar = () => {

    const [ searchText, setSearchText ] = useState("");
    const inputRef = useRef(null);

    const dispatch = useDispatch();
    const { setKeyword } = bindActionCreators( navigationActionCreators, dispatch );

    const handleSearchHandler = (e) => {
        e.preventDefault();
        if(searchText.trim()){
            setKeyword(searchText);
            inputRef.current.blur();
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
                    setSearchText(e.target.value)
                }}
                ref={inputRef}
            />

            <button type="submit" className="search-toggle" >
                <TfiSearch color='black' size={"22px"} />
            </button>
        </form>
    )
}

export default SearchBar
