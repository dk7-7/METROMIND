import React from "react";

const SearchFilterBar = ({ onSearch, onFilterChange, filterOptions = [] }) => {
  return (
    <div className="search-filter-bar">
      <input
        type="text"
        placeholder="Search by title..."
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <select onChange={(e) => onFilterChange && onFilterChange(e.target.value)} defaultValue="">
        <option value="">All Statuses</option>
        {filterOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilterBar;
