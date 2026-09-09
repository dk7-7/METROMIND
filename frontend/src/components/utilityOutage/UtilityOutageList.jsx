import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord, resolveOutage } from '../../store/slices/utilityOutageSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import UtilityOutageForm from './UtilityOutageForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

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
          <div className="page-title-row">
            <h1 className="page-title">
              <span>🔌</span> Utility Outages
            </h1>
            <span className="badge-record-count">
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
        <div className="loading-state">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No utility outages found." />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Affected Area</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Restoration Estimate</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((outage) => {
                  const id = outage.outageId || outage.id;
                  const isRestored = outage.status === 'RESTORED';
                  const sevClass = `severity-${(outage.severity || 'low').toLowerCase()}`;
                  const statClass = isRestored ? 'status-restored' : 'status-active';

                  return (
                    <tr key={id}>
                      <td>
                        <span className="outage-type-badge">
                          {outage.outageType}
                        </span>
                      </td>
                      <td className="td-affected-area">
                        <div className="affected-area-wrapper">
                          <span>📍</span>
                          <span>{outage.affectedArea}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${sevClass}`}>
                          {outage.severity || 'MEDIUM'}
                        </span>
                      </td>
                      <td>
                        <span className={`outage-status-indicator ${statClass}`}>
                          <span className="status-dot" />
                          {outage.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="td-restoration-estimate">
                        {outage.estimatedRestorationTime ? (
                          <div className="restoration-time-wrapper">
                            <span>⏱️</span>
                            <span>{new Date(outage.estimatedRestorationTime).toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="tbd-text">TBD</span>
                        )}
                      </td>
                      <td className="td-actions">
                        <div className="action-button-group">
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