import React from 'react';
import './Pagination.css';

const Pagination = ({
  totalItems = 0,
  itemsPerPage = 5,
  currentPage = 1,
  onPageChange,
}) => {
  const effectiveItemsPerPage = itemsPerPage > 0 ? itemsPerPage : 5;
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / effectiveItemsPerPage));
  const page = Math.max(1, Math.min(currentPage || 1, totalPages));

  const handlePrev = () => {
    if (page > 1 && onPageChange) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages && onPageChange) {
      onPageChange(page + 1);
    }
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Page {page} of {totalPages}
      </div>

      <div className="pagination-actions">
        <button
          type="button"
          className="btn-prev"
          onClick={handlePrev}
          disabled={page <= 1}
        >
          Previous
        </button>

        <button
          type="button"
          className="btn-next"
          onClick={handleNext}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;