import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, markRead } from '../../store/slices/alertNotificationSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import AlertNotificationForm from './AlertNotificationForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

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
    <div className="alert-list-container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Alert Notifications
        </h1>

        {canBroadcast && (
          <button
            type="button"
            className="btn-broadcast-alert"
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Broadcast Alert
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Loading alerts...
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No alerts found." />
      ) : (
        <>
          <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Severity</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Message</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Target Role</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((alert) => {
                  const id = alert.alertId || alert.id;
                  const isRead = !!(alert.isRead || alert.read);
                  return (
                    <tr
                      key={id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: isRead ? '#ffffff' : '#f8fafc',
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            backgroundColor:
                              alert.severity === 'CRITICAL' ? '#fee2e2' :
                              alert.severity === 'HIGH' ? '#ffedd5' :
                              alert.severity === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                            color:
                              alert.severity === 'CRITICAL' ? '#b91c1c' :
                              alert.severity === 'HIGH' ? '#c2410c' :
                              alert.severity === 'MEDIUM' ? '#b45309' : '#15803d',
                          }}
                        >
                          {alert.severity || 'LOW'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: isRead ? 400 : 600 }}>
                        {alert.message}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#64748b' }}>
                        {alert.targetRole || 'ALL'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                        <span style={{ color: isRead ? '#94a3b8' : '#2563eb', fontWeight: 600 }}>
                          {isRead ? 'Read' : 'New'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        {!isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkRead(id)}
                            style={{
                              padding: '0.25rem 0.6rem',
                              fontSize: '0.8rem',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              backgroundColor: '#ffffff',
                              color: '#334155',
                              cursor: 'pointer',
                            }}
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
        </>
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