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
        gap: '0.85rem',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: '0.85rem 1.15rem',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ flex: '1 1 260px', position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            pointerEvents: 'none',
          }}
        >
          🔍
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search records by title / query..."
          value={searchValue}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '0.55rem 0.85rem 0.55rem 2.25rem',
            border: '1px solid var(--border-default)',
            borderRadius: '6px',
            fontSize: '0.9rem',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <select
          className="filter-select"
          aria-label="Filter by status"
          value={filterValue}
          onChange={handleFilterChange}
          style={{
            width: '100%',
            padding: '0.55rem 0.85rem',
            border: '1px solid var(--border-default)',
            borderRadius: '6px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontWeight: 500,
            boxSizing: 'border-box',
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