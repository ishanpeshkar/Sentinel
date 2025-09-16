import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            // We navigate to a new route with the search query
            // The new page will handle the geocoding and data fetching
            navigate(`/location/${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form className="search-bar-container" onSubmit={handleSearch}>
            <input
                type="text"
                className="search-input"
                placeholder="Enter a location (e.g., London, New York...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
};

export default SearchBar;