import React from 'react';

const SearchFilterBar = ({ onSearch, onFilterChange, filterOptions = [] }) => {
    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <input 
                type="text" 
                placeholder="Search by title" 
                onChange={(e) => onSearch(e.target.value)}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
            />
            {filterOptions.length > 0 && (
                <select 
                    onChange={(e) => onFilterChange(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">All Statuses</option>
                    {filterOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default SearchFilterBar;
