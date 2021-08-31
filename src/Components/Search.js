import React, { useState } from 'react';
import classes from '../App.module.css';

const Tag = () => {
    return(
        <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ paddingTop: '4px' }}>
            <path d="M19.59 12.41L12.42 19.58C12.2343 19.766 12.0137 19.9135 11.7709 20.0141C11.5281 20.1148 11.2678 20.1666 11.005 20.1666C10.7422 20.1666 10.4819 20.1148 10.2391 20.0141C9.99632 19.9135 9.77575 19.766 9.59 19.58L1 11V1H11L19.59 9.59C19.9625 9.96473 20.1716 10.4716 20.1716 11C20.1716 11.5284 19.9625 12.0353 19.59 12.41V12.41Z" stroke="#8E8E93" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

const Search = (props) => {
    const [search, setSearch] = useState({ query: null });
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState({ data: null });

    const handleGetCollections = async () => {
        const response = await fetch('https://slate.host/api/v2/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'SLA2a459dde-9433-43a5-966c-cf5603db59f7TE',
          }
        });

        if (!response) {
            console.log("No response");
            return;
        }

        const json = await response.json();
        if (json.error) {
            console.log(json);
        } else {
            const collections = json.collections;
            const user = json.user;
        }

        //setSearchResults({ data: json.collections })
        //console.log('searchLL ', json.collections)
        return json.collections;
    }

    const handleSearchChange = async (e) => {
        setSearch({ query: e.target.value });

        let checkType = e.target.value.includes("†")
        console.log('in the type 1', checkType)
        if (checkType) {
            console.log('in the type 2')
            let final = e.target.value.replace("†", "type:");
            setSearch({ query: final });
            return;
        }

        let checkFrom = e.target.value.includes("ƒ")
        if (checkFrom) {
            let final = e.target.value.replace("ƒ", "from:");
            setSearch({ query: final });
            return;
        }

        let checkScreenshot = e.target.value.includes("å")
        if (checkScreenshot) {
            let final = e.target.value.replace("å", "");
            setSearch({ query: final });
            window.postMessage({ type: "OPEN_SCREENSHOT_SHORTCUT" }, "*");
            return;
        }

        let checkBookmark = e.target.value.includes("∫")
        if (checkBookmark) {
            let final = e.target.value.replace("∫", " ");
            setSearch({ query: final });
            console.log('send message to bookmark')

            window.postMessage({
                type: "SAVE_LINK",
                url: window.location.href
            }, "*");

            return;
        }

        if(e.target.value === null || e.target.value === "" || e.target.value === " ") {
            console.log('target is empty')
            setSearch({ query: null })
            setSearchResults({ data: null })
            setIsSearching(false)
            return;
        }


        let results = await handleGetCollections();
        let resultsArray = Array.from(results);
        let filteredResults = resultsArray.filter(function (e) {
            return e.slatename.includes(search.query);
        });
        setSearchResults({ data: filteredResults })
        setIsSearching(true)
    }

    const handleSearch = (e) => {
        console.log('event from the search compnent: ', e)
        if (e.key === "Enter") {
            window.postMessage({
                type: "OPEN_SEARCH",
                query: e.target.value
            }, "*");
        }

        if (e.key === "Escape") {
            window.postMessage({
                type: "CLOSE_APP",
            }, "*");
        }

        if (e.key === "Escape") {
            window.postMessage({
                type: "CLOSE_APP",
            }, "*");
        }
    }

    const handleCloseModal = () => {
		window.postMessage({ type: "CLOSE_APP" }, "*");
    }

    const handCloseSearch = () => {
        setSearch({ query: "" })
        setSearchResults({ data: null })
        setIsSearching(false)
    }

    return ( 
    	<div>
        	<input 
				className={classes.modalSearchInput}
				value={search.query}
				ref={input => input && input.focus()}
				autocomplete="off" 
                placeholder="Search your Slate..."
                onKeyDown={(e) => {handleSearch(e)}}
                onChange={(e) => {handleSearchChange(e)}}
                autoFocus
			/> 

            {isSearching ?
                <div 
                    className={classes.modalCloseButton}
                    style={{ position: 'absolute', right: '0px', top: '14px', color: '#C7C7CC', cursor: 'pointer' }}
                    onClick={handCloseSearch}
                >Clear</div>
            :
                <div 
    				className={classes.modalCloseButton}
    				style={{ position: 'absolute', right: '0px', top: '14px', color: '#48494A', cursor: 'pointer' }}
    				onClick={handleCloseModal}
                >X</div>
            }

            {isSearching &&
                <div className={classes.modalSearchDropdown}>
                    <div>
                        <span style={{ fontSize: '12px', color: '#C7C7CC', paddingLeft: '8px' }}>open a collection or tag</span>
                    </div>
                    {searchResults.data.map((slate, index) => (
                        <div
                            className={classes.modalSearchItem}
                            onClick={() => window.open(slate.data.url, "_blank")}
                            key={index}
                        >
                            <Tag /> <span style={{ paddingLeft: '8px' }}>{slate.slatename}</span>
                        </div>
                    ))}
                </div>
            }
		</div>
    );
};

export default Search;