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
    <div className="outage-list-container animate-fade-in">
      {/* Header section */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h1 className="page-title">
              <span>🔌</span> Utility Outages
            </h1>
            <span
              style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                fontSize: '0.775rem',
                fontWeight: 700,
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}
            >
              {items.length} Outages
            </span>
          </div>
          <p className="page-subtitle">
            Track active service disruptions, dispatch restoration crews, and manage recovery schedules
          </p>
        </div>

        {canAdd && (
          <button
            type="button"
            className="btn-add-outage btn-primary"
            onClick={handleAdd}
          >
            <span>+</span> Add Outage
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
        <div className="table-card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Affected Area</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Restoration Estimate</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((outage) => {
                  const id = outage.outageId || outage.id;
                  const isRestored = outage.status === 'RESTORED';
                  const sevStyle = getSeverityStyle(outage.severity);
                  return (
                    <tr key={id}>
                      <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-main)',
                            fontFamily: 'monospace',
                            fontSize: '0.8125rem',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {outage.outageType}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>📍</span>
                          <span>{outage.affectedArea}</span>
                        </div>
                      </td>
                      <td>
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
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            color: isRestored ? '#10b981' : '#f59e0b',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isRestored ? '#10b981' : '#f59e0b',
                              boxShadow: `0 0 6px ${isRestored ? '#10b981' : '#f59e0b'}`,
                            }}
                          />
                          {outage.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {outage.estimatedRestorationTime ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>⏱️</span>
                            <span>{new Date(outage.estimatedRestorationTime).toLocaleString()}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>TBD</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {!isRestored && canResolve && (
                            <button
                              type="button"
                              className="btn-action-resolve"
                              onClick={() => handleResolve(id)}
                            >
                              Resolve
                            </button>
                          )}
                          {canAdd && (
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => handleEdit(outage)}
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleDelete(id)}
                            >
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