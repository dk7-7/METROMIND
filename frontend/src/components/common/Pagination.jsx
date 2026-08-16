import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="pagination">
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage <= 1}
            >
                Previous
            </button>
            <span style={{ margin: '0 10px' }}>
                Page {currentPage} of {totalPages || 1}
            </span>
            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage >= totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
