import React from 'react';

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
    <div
      className="search-filter-bar"
      style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <div style={{ flex: '1 1 240px' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search by title..."
          value={searchValue}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '0.9rem',
          }}
        />
      </div>

      <div style={{ minWidth: '160px' }}>
        <select
          className="filter-select"
          aria-label="Filter by status"
          value={filterValue}
          onChange={handleFilterChange}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '0.9rem',
            backgroundColor: '#ffffff',
          }}
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