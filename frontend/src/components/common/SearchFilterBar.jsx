import React from 'react';
import './SearchFilterBar.css';

const SearchFilterBar = ({
  onSearch,
  onFilterChange,
  filterOptions = [],
  searchValue = '',
  filterValue = '',
}) => {
  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleFilterChange = (e) => {
    if (onFilterChange) {
      onFilterChange(e.target.value);
    }
  };

  const defaultOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Reported', value: 'REPORTED' },
    { label: 'Dispatched', value: 'DISPATCHED' },
    { label: 'Investigating', value: 'INVESTIGATING' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  const options = filterOptions && filterOptions.length > 0 ? filterOptions : defaultOptions;

  return (
    <div className="search-filter-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-select-wrapper">
        <select
          className="filter-select"
          aria-label="Filter by status"
          value={filterValue}
          onChange={handleFilterChange}
        >
          {options.map((opt, idx) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={idx} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default SearchFilterBar;