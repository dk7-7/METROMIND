import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord, resolveOutage } from '../../store/slices/utilityOutageSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import UtilityOutageForm from './UtilityOutageForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

const getSeverityStyle = (severity) => {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
    case 'HIGH':
      return { bg: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.3)' };
    case 'MEDIUM':
      return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
    case 'LOW':
    default:
      return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
  }
};

const UtilityOutageList = () => {
  const dispatch = useDispatch();
  const { items = [], loading } = useSelector((state) => state.utilityOutage || {});
  const { user } = useSelector((state) => state.auth || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutage, setEditingOutage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const role = user?.role || localStorage.getItem('role') || '';
  const canAdd = role === 'CITY_ADMINISTRATOR' || role === 'UTILITY_SUPERVISOR';
  const canResolve = role === 'UTILITY_SUPERVISOR' || role === 'CITY_ADMINISTRATOR';
  const canDelete = role === 'CITY_ADMINISTRATOR';

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this outage?');
    if (!confirmed) return;

    const resultAction = await dispatch(deleteRecord(id));
    if (deleteRecord.fulfilled.match(resultAction)) {
      const msg = 'UtilityOutage deleted successfully.';
      setSuccessMessage(msg);
      dispatch(addNotification({ message: msg, type: 'success' }));
      dispatch(fetchAll());
    }
  };

  const handleResolve = async (id) => {
    const resultAction = await dispatch(resolveOutage(id));
    if (resolveOutage.fulfilled.match(resultAction)) {
      const msg = 'Outage marked as restored.';
      setSuccessMessage(msg);
      dispatch(addNotification({ message: msg, type: 'success' }));
      dispatch(fetchAll());
    }
  };

  const handleEdit = (outage) => {
    setEditingOutage(outage);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingOutage(null);
    setIsModalOpen(true);
  };

  // Pagination - 5 items per page
  const itemsPerPage = 5;
  const totalItems = items.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="outage-list-container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(239, 68, 68, 0.1))',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f97316',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              Utility Outages & Disruptions
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Track active service disruptions, dispatch restoration crews, and manage recovery schedules.
          </p>
        </div>

        {canAdd && (
          <button
            type="button"
            className="btn-add-outage btn-primary"
            onClick={handleAdd}
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            + Add Record
          </button>
        )}
      </div>

      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          duration={4000}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {loading && items.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton" style={{ height: '56px', borderRadius: '8px' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No utility outages found." />
      ) : (
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Type
                  </th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Affected Area
                  </th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Severity
                  </th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status
                  </th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Restoration Estimate
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((outage) => {
                  const id = outage.outageId || outage.id;
                  const isRestored = outage.status === 'RESTORED';
                  const sevStyle = getSeverityStyle(outage.severity);
                  return (
                    <tr
                      key={id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            color: '#e2e8f0',
                            fontFamily: 'monospace',
                            fontSize: '0.8125rem',
                          }}
                        >
                          {outage.outageType}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{outage.affectedArea}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backgroundColor: sevStyle.bg,
                            color: sevStyle.color,
                            border: `1px solid ${sevStyle.border}`,
                            letterSpacing: '0.02em',
                          }}
                        >
                          {outage.severity || 'MEDIUM'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            color: isRestored ? '#34d399' : '#fbbf24',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isRestored ? '#34d399' : '#fbbf24',
                              boxShadow: `0 0 6px ${isRestored ? '#34d399' : '#fbbf24'}`,
                            }}
                          />
                          {outage.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
                        {outage.estimatedRestorationTime ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>{new Date(outage.estimatedRestorationTime).toLocaleString()}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b', fontStyle: 'italic' }}>TBD</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {!isRestored && canResolve && (
                            <button
                              type="button"
                              className="btn-action-resolve"
                              onClick={() => handleResolve(id)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.8125rem',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: '#34d399',
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Resolve
                            </button>
                          )}
                          {canAdd && (
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => handleEdit(outage)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.8125rem',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: '#e2e8f0',
                                cursor: 'pointer',
                                fontWeight: 500,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleDelete(id)}
                              style={{
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.8125rem',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#f87171',
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {isModalOpen && (
        <UtilityOutageForm
          outage={editingOutage}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(msg) => {
            setSuccessMessage(msg);
            dispatch(fetchAll());
          }}
        />
      )}
    </div>
  );
};

export default UtilityOutageList;