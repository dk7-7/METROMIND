import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord, resolveOutage } from '../../store/slices/utilityOutageSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import UtilityOutageForm from './UtilityOutageForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';
import ErrorHandler from '../common/ErrorHandler';

const UtilityOutageList = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.utilityOutage || state.utilityOutages || {});
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
  const rawItems = Array.isArray(items) ? items : [];
  const totalItems = rawItems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rawItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="outage-list-container">
      <div className="page-header">
        <h1>Utility Outages</h1>

        {canAdd && (
          <button
            type="button"
            className="btn-add-outage"
            onClick={handleAdd}
          >
            + Add Outage
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
        <EmptyState message="No utility outages found." />
      ) : (
        <>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Affected Area</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Estimated Restoration Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((outage) => {
                  const id = outage.outageId || outage.id;
                  const isRestored = outage.status === 'RESTORED';

                  return (
                    <tr key={id}>
                      <td>{outage.outageType}</td>
                      <td>{outage.affectedArea}</td>
                      <td>{outage.severity || 'MEDIUM'}</td>
                      <td>{outage.status || 'ACTIVE'}</td>
                      <td>{outage.estimatedRestorationTime || 'N/A'}</td>
                      <td>
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
        </>
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