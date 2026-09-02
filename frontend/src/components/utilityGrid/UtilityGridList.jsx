import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord } from '../../store/slices/utilityGridSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import UtilityGridForm from './UtilityGridForm';
import CapacityBar from '../common/CapacityBar';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

const UtilityGridList = () => {
  const dispatch = useDispatch();
  const { items = [], loading } = useSelector(
    (state) => state.utilityGrid || {}
  );
  const { user } = useSelector((state) => state.auth || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrid, setEditingGrid] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const role = user?.role || localStorage.getItem('role') || '';
  const canAdd = role === 'CITY_ADMINISTRATOR';
  const canEdit = role === 'CITY_ADMINISTRATOR' || role === 'UTILITY_SUPERVISOR';
  const canDelete = role === 'CITY_ADMINISTRATOR';

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this utility grid?');
    if (!confirmed) return;

    const resultAction = await dispatch(deleteRecord(id));
    if (deleteRecord.fulfilled.match(resultAction)) {
      const msg = 'UtilityGrid deleted successfully.';
      setSuccessMessage(msg);
      dispatch(addNotification({ message: msg, type: 'success' }));
      dispatch(fetchAll());
    }
  };

  const handleEdit = (grid) => {
    setEditingGrid(grid);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingGrid(null);
    setIsModalOpen(true);
  };

  // Pagination - 5 items per page
  const itemsPerPage = 5;
  const totalItems = items.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="grid-list-container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Utility Grids
        </h1>

        {canAdd && (
          <button
            type="button"
            className="btn-add-grid"
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
          Loading utility grids...
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No utility grids monitored." />
      ) : (
        <>
          <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Grid Name</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Grid Type</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>District</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', minWidth: '180px' }}>Capacity</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((grid) => {
                  const id = grid.gridId || grid.id;
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                        {grid.gridName}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#475569' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: '#f1f5f9',
                            fontWeight: 500,
                          }}
                        >
                          {grid.gridType}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {grid.district}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <CapacityBar
                          current={grid.currentLoad || 0}
                          total={grid.capacityUnits || 100}
                        />
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleEdit(grid)}
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
        <UtilityGridForm
          grid={editingGrid}
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

export default UtilityGridList;