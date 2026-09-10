import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, markRead } from '../../store/slices/alertNotificationSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import AlertNotificationForm from './AlertNotificationForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';
import ErrorHandler from '../common/ErrorHandler';

const AlertNotificationList = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.alertNotification || state.alertNotifications || {});
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
  const rawItems = Array.isArray(items) ? items : [];
  const totalItems = rawItems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rawItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="alert-list-container">
      <div className="page-header">
        <h1>Alerts</h1>

        {canBroadcast && (
          <button
            type="button"
            className="btn-broadcast-alert"
            onClick={() => setIsModalOpen(true)}
          >
            + Broadcast Alert
          </button>
        )}
      </div>

      {error && <ErrorHandler error={error} />}

      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          duration={3000}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {loading && rawItems.length === 0 && !error ? (
        <div className="loading-state">Loading...</div>
      ) : rawItems.length === 0 ? (
        <EmptyState message="No alerts found." />
      ) : (
        <>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Message</th>
                  <th>Target Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((alert) => {
                  const id = alert.alertId || alert.id;
                  const isRead = !!(alert.isRead || alert.read);

                  return (
                    <tr key={id}>
                      <td>{alert.severity || 'LOW'}</td>
                      <td>{alert.message}</td>
                      <td>{alert.targetRole || 'ALL'}</td>
                      <td>{isRead ? 'Read' : 'Unread'}</td>
                      <td>
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