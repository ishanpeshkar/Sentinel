import React from 'react';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Enter a location to check its safety..."
      />
      <button className="search-button">Search</button>
    </div>
  );
};

export default SearchBar;