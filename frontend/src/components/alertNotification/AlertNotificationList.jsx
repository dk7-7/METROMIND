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
    <div className="alert-list-container animate-fade-in">
      {/* Header section */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title-row">
            <h1 className="page-title">
              <span>⚠️</span> Alerts & Broadcasts
            </h1>
            <span className="badge-record-count">
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
        <div className="loading-state">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No alerts found." />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Alert Message</th>
                  <th>Target Role</th>
                  <th>Status</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((alert) => {
                  const id = alert.alertId || alert.id;
                  const isRead = !!(alert.isRead || alert.read);
                  const sevClass = `severity-${(alert.severity || 'low').toLowerCase()}`;

                  return (
                    <tr
                      key={id}
                      className={isRead ? 'alert-row-read' : 'alert-row-unread'}
                    >
                      <td>
                        <span className={`status-badge ${sevClass}`}>
                          {alert.severity || 'LOW'}
                        </span>
                      </td>
                      <td className={isRead ? 'alert-msg-read' : 'alert-msg-unread'}>
                        <div className="alert-msg-text">{alert.message}</div>
                      </td>
                      <td>
                        <span className="target-role-badge">
                          {alert.targetRole || 'ALL'}
                        </span>
                      </td>
                      <td>
                        <span className={`alert-read-status ${isRead ? 'read' : 'new'}`}>
                          <span className="status-dot" />
                          {isRead ? 'Read' : 'New'}
                        </span>
                      </td>
                      <td className="td-actions">
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