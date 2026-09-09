import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord } from '../../store/slices/utilityGridSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import UtilityGridForm from './UtilityGridForm';
import CapacityBar from '../common/CapacityBar';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

const getGridIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'POWER':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'WATER':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case 'GAS':
      return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    default:
      return null;
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
          <div className="page-title-row">
            <h1 className="page-title">
              <span>⚡</span> Utility Grids
            </h1>
            <span className="badge-record-count">
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
        <div className="loading-state">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No utility grids monitored." />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Grid Name</th>
                  <th>Grid Type</th>
                  <th>District</th>
                  <th className="th-capacity">Capacity & Load</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((grid) => {
                  const id = grid.gridId || grid.id;
                  const typeName = (grid.gridType || 'other').toLowerCase();

                  return (
                    <tr key={id}>
                      <td className="td-grid-name">
                        <div className="grid-name-wrapper">
                          <span className={`grid-status-dot grid-type-dot-${typeName}`} />
                          <span>{grid.gridName}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge-grid-type grid-type-${typeName}`}>
                          {getGridIcon(grid.gridType)}
                          {grid.gridType}
                        </span>
                      </td>
                      <td className="td-district">
                        <div className="district-wrapper">
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
                      <td className="td-actions">
                        <div className="action-button-group">
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