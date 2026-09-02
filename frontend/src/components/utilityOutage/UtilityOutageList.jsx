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
    <div className="outage-list-container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Utility Outages
        </h1>

        {canAdd && (
          <button
            type="button"
            className="btn-add-outage"
            onClick={handleAdd}
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

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          Loading utility outages...
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No utility outages found." />
      ) : (
        <>
          <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Type</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Affected Area</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Severity</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Restoration Estimate</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((outage) => {
                  const id = outage.outageId || outage.id;
                  const isRestored = outage.status === 'RESTORED';
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                        {outage.outageType}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#475569' }}>
                        {outage.affectedArea}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            backgroundColor:
                              outage.severity === 'CRITICAL' ? '#fee2e2' :
                              outage.severity === 'HIGH' ? '#ffedd5' :
                              outage.severity === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
                            color:
                              outage.severity === 'CRITICAL' ? '#b91c1c' :
                              outage.severity === 'HIGH' ? '#c2410c' :
                              outage.severity === 'MEDIUM' ? '#b45309' : '#15803d',
                          }}
                        >
                          {outage.severity || 'MEDIUM'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                        <span
                          style={{
                            fontWeight: 600,
                            color: isRestored ? '#15803d' : '#b45309',
                          }}
                        >
                          {outage.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#64748b' }}>
                        {outage.estimatedRestorationTime
                          ? new Date(outage.estimatedRestorationTime).toLocaleString()
                          : 'TBD'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          {!isRestored && canResolve && (
                            <button
                              type="button"
                              onClick={() => handleResolve(id)}
                              style={{
                                padding: '0.25rem 0.6rem',
                                fontSize: '0.8rem',
                                border: '1px solid #86efac',
                                borderRadius: '4px',
                                backgroundColor: '#dcfce7',
                                color: '#15803d',
                                cursor: 'pointer',
                                fontWeight: 500,
                              }}
                            >
                              Resolve
                            </button>
                          )}
                          {canAdd && (
                            <button
                              type="button"
                              onClick={() => handleEdit(outage)}
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
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleDelete(id)}
                              style={{
                                padding: '0.25rem 0.6rem',
                                fontSize: '0.8rem',
                                border: '1px solid #fca5a5',
                                borderRadius: '4px',
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
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