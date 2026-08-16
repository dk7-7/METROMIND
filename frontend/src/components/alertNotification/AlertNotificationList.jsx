import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll, markRead, clearMessages } from "../../store/slices/alertNotificationSlice";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import Alert from "../common/Alert";
import AlertNotificationForm from "./AlertNotificationForm";

const ITEMS_PER_PAGE = 5;

const AlertNotificationList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, successMessage } = useSelector(
    (state) => state.alertNotification
  );
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const canManage = role === "CITY_ADMINISTRATOR";

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const paginated = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Alert Notifications</h2>
        {canManage && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Add Alert
          </button>
        )}
      </div>

      {successMessage && (
        <Alert message={successMessage} type="success" onDismiss={() => dispatch(clearMessages())} />
      )}
      {error && <Alert message={error} type="error" onDismiss={() => dispatch(clearMessages())} />}

      {!loading && items.length === 0 ? (
        <EmptyState message="No alerts found." />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Message</th>
                <th>Severity</th>
                <th>Target Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((alert) => (
                <tr key={alert.alertId}>
                  <td>{alert.message}</td>
                  <td>{alert.severity}</td>
                  <td>{alert.targetRole}</td>
                  <td>{alert.createdAt}</td>
                  <td>
                    {!alert.isRead && (
                      <button
                        className="action-link"
                        onClick={() => dispatch(markRead(alert.alertId))}
                      >
                        Mark Read
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalItems={items.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}

      {showForm && <AlertNotificationForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default AlertNotificationList;
