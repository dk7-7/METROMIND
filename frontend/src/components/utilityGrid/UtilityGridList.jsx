import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord } from '../../store/slices/utilityGridSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import UtilityGridForm from './UtilityGridForm';
import CapacityBar from '../common/CapacityBar';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

const getGridTypeStyle = (type) => {
  switch (type?.toUpperCase()) {
    case 'POWER':
      return {
        bg: 'rgba(245, 158, 11, 0.12)',
        color: '#f59e0b',
        border: 'rgba(245, 158, 11, 0.3)',
        icon: (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        ),
      };
    case 'WATER':
      return {
        bg: 'rgba(6, 182, 212, 0.12)',
        color: '#06b6d4',
        border: 'rgba(6, 182, 212, 0.3)',
        icon: (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        ),
      };
    case 'GAS':
      return {
        bg: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        border: 'rgba(16, 185, 129, 0.3)',
        icon: (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        ),
      };
    default:
      return {
        bg: 'rgba(100, 116, 139, 0.12)',
        color: '#94a3b8',
        border: 'rgba(100, 116, 139, 0.3)',
        icon: null,
      };
  }
};

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
    <div className="grid-list-container animate-fade-in">
      {/* Header section */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h1 className="page-title">
              <span>⚡</span> Utility Grids
            </h1>
            <span
              style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                color: '#2563eb',
                fontSize: '0.775rem',
                fontWeight: 700,
                border: '1px solid rgba(37, 99, 235, 0.25)',
              }}
            >
              {items.length} Grids
            </span>
          </div>
          <p className="page-subtitle">
            Monitor real-time load telemetry, power distribution networks, and municipal substations
          </p>
        </div>

        {canAdd && (
          <button
            type="button"
            className="btn-add-grid btn-primary"
            onClick={handleAdd}
          >
            <span>+</span> Add Utility Grid
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
        <EmptyState message="No utility grids monitored." />
      ) : (
        <div className="table-card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Grid Name</th>
                  <th>Grid Type</th>
                  <th>District</th>
                  <th style={{ minWidth: '220px' }}>Capacity & Load</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((grid) => {
                  const id = grid.gridId || grid.id;
                  const typeStyle = getGridTypeStyle(grid.gridType);
                  return (
                    <tr key={id}>
                      <td style={{ fontSize: '0.925rem', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: typeStyle.color,
                              boxShadow: `0 0 6px ${typeStyle.color}`,
                            }}
                          />
                          <span>{grid.gridName}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '6px',
                            backgroundColor: typeStyle.bg,
                            color: typeStyle.color,
                            border: `1px solid ${typeStyle.border}`,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {typeStyle.icon}
                          {grid.gridType}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>📍</span>
                          <span>{grid.district}</span>
                        </div>
                      </td>
                      <td>
                        <CapacityBar
                          current={grid.currentLoad || 0}
                          total={grid.capacityUnits || 100}
                        />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {canEdit && (
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => handleEdit(grid)}
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