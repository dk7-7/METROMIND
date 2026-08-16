import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage <= 1}
                style={{ padding: '0.5rem 1rem', cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}>
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage >= totalPages}
                style={{ padding: '0.5rem 1rem', cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
