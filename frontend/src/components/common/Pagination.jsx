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
    <div
      className="pagination-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '1rem',
        padding: '0.5rem 0',
      }}
    >
      <button
        type="button"
        className="btn-pagination btn-prev"
        onClick={handlePrev}
        disabled={page <= 1}
      >
        Previous
      </button>

      <span className="pagination-info" style={{ fontSize: '0.9rem', color: '#475569' }}>
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        className="btn-pagination btn-next"
        onClick={handleNext}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;