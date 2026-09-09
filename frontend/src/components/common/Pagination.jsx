import React from 'react';

const Pagination = ({
  totalItems = 0,
  itemsPerPage = 5,
  currentPage = 1,
  onPageChange,
}) => {
  const effectiveItemsPerPage = itemsPerPage > 0 ? itemsPerPage : 5;
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / effectiveItemsPerPage));
  const page = Math.max(1, Math.min(currentPage || 1, totalPages));

  const startRecord = totalItems === 0 ? 0 : (page - 1) * effectiveItemsPerPage + 1;
  const endRecord = Math.min(page * effectiveItemsPerPage, totalItems);

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
    <div className="pagination-container pagination">
      <div className="pagination-summary">
        <span className="pagination-info">
          Showing <strong>{startRecord}–{endRecord}</strong> of <strong>{totalItems}</strong> entries
        </span>
        <span className="pagination-badge">
          Page {page} of {totalPages}
        </span>
      </div>

      <div className="pagination-actions">
        <button
          type="button"
          className="btn-pagination btn-prev"
          onClick={handlePrev}
          disabled={page <= 1}
        >
          <span>←</span> Previous
        </button>

        <button
          type="button"
          className="btn-pagination btn-next"
          onClick={handleNext}
          disabled={page >= totalPages}
        >
          Next <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;