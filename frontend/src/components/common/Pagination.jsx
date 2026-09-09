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
    <div
      className="pagination-container pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.25rem',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <span className="pagination-info" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-main)', fontWeight: 650 }}>{startRecord}–{endRecord}</strong> of <strong style={{ color: 'var(--text-main)', fontWeight: 650 }}>{totalItems}</strong> entries
        </span>
        <span
          style={{
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          Page {page} of {totalPages}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          type="button"
          className="btn-pagination btn-prev"
          onClick={handlePrev}
          disabled={page <= 1}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.9rem',
            border: '1px solid var(--border-default)',
            backgroundColor: page <= 1 ? 'var(--bg-subtle)' : 'var(--bg-surface)',
            color: page <= 1 ? 'var(--text-muted)' : 'var(--text-main)',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: page <= 1 ? 'not-allowed' : 'pointer',
            boxShadow: page <= 1 ? 'none' : 'var(--shadow-xs)',
            transition: 'all 0.15s ease',
          }}
        >
          <span>←</span> Previous
        </button>

        <button
          type="button"
          className="btn-pagination btn-next"
          onClick={handleNext}
          disabled={page >= totalPages}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.9rem',
            border: '1px solid var(--border-default)',
            backgroundColor: page >= totalPages ? 'var(--bg-subtle)' : 'var(--bg-surface)',
            color: page >= totalPages ? 'var(--text-muted)' : 'var(--text-main)',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
            boxShadow: page >= totalPages ? 'none' : 'var(--shadow-xs)',
            transition: 'all 0.15s ease',
          }}
        >
          Next <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;