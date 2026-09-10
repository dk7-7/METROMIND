import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord } from '../../store/slices/utilityGridSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import UtilityGridForm from './UtilityGridForm';
import CapacityBar from '../common/CapacityBar';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';
import ErrorHandler from '../common/ErrorHandler';

const UtilityGridList = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector(
    (state) => state.utilityGrid || state.utilityGrids || {}
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
  const rawItems = Array.isArray(items) ? items : [];
  const totalItems = rawItems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rawItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="grid-list-container">
      <div className="page-header">
        <h1>Utility Grids</h1>

        {canAdd && (
          <button
            type="button"
            className="btn-add-grid"
            onClick={handleAdd}
          >
            + Add Grid
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
        <EmptyState message="No utility grids monitored." />
      ) : (
        <>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Grid Name</th>
                  <th>Grid Type</th>
                  <th>District</th>
                  <th>Capacity & Load</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((grid) => {
                  const id = grid.gridId || grid.id;

                  return (
                    <tr key={id}>
                      <td>{grid.gridName || grid.name}</td>
                      <td>{grid.gridType || grid.type}</td>
                      <td>{grid.district}</td>
                      <td>
                        <CapacityBar
                          current={grid.currentLoad || 0}
                          total={grid.capacityUnits || 100}
                        />
                      </td>
                      <td>
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