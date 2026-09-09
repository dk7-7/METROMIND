import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, markRead } from '../../store/slices/alertNotificationSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import AlertNotificationForm from './AlertNotificationForm';
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

const AlertNotificationList = () => {
  const dispatch = useDispatch();
  const { items = [], loading } = useSelector((state) => state.alertNotification || {});
  const { user } = useSelector((state) => state.auth || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const role = user?.role || localStorage.getItem('role') || '';
  const canBroadcast = role === 'CITY_ADMINISTRATOR';

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    const resultAction = await dispatch(markRead(id));
    if (markRead.fulfilled.match(resultAction)) {
      dispatch(addNotification({ message: 'Alert marked as read.', type: 'info' }));
      dispatch(fetchAll());
    }
  };

  // Pagination - 5 items per page
  const itemsPerPage = 5;
  const totalItems = items.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="alert-list-container animate-fade-in">
      {/* Header section */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h1 className="page-title">
              <span>⚠️</span> Alerts & Broadcasts
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
              {items.length} Alerts
            </span>
          </div>
          <p className="page-subtitle">
            Citywide emergency bulletins, operational notices, and inter-departmental dispatch logs
          </p>
        </div>

        {canBroadcast && (
          <button
            type="button"
            className="btn-broadcast-alert btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <span>+</span> Broadcast Alert
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
        <EmptyState message="No alerts found." />
      ) : (
        <div className="table-card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Alert Message</th>
                  <th>Target Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((alert) => {
                  const id = alert.alertId || alert.id;
                  const isRead = !!(alert.isRead || alert.read);
                  const sevStyle = getSeverityStyle(alert.severity);
                  return (
                    <tr
                      key={id}
                      style={{
                        backgroundColor: isRead ? 'transparent' : 'rgba(37, 99, 235, 0.04)',
                        borderLeft: isRead ? '3px solid transparent' : '3px solid #3b82f6',
                      }}
                    >
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
                          {alert.severity || 'LOW'}
                        </span>
                      </td>
                      <td
                        style={{
                          fontSize: '0.875rem',
                          color: isRead ? 'var(--text-muted)' : 'var(--text-main)',
                          fontWeight: isRead ? 400 : 600,
                          maxWidth: '450px',
                        }}
                      >
                        <div style={{ lineHeight: 1.45 }}>{alert.message}</div>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-muted)',
                            fontFamily: 'monospace',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {alert.targetRole || 'ALL'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontWeight: 600,
                            color: isRead ? 'var(--text-muted)' : '#3b82f6',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: isRead ? 'var(--text-muted)' : '#3b82f6',
                              boxShadow: isRead ? 'none' : '0 0 6px #3b82f6',
                            }}
                          />
                          {isRead ? 'Read' : 'New'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {!isRead && (
                          <button
                            type="button"
                            className="btn-action-edit"
                            onClick={() => handleMarkRead(id)}
                          >
                            Mark as Read
                          </button>
                        )}
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
        <AlertNotificationForm
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

export default AlertNotificationList;