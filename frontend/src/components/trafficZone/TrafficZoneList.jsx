import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord } from '../../store/slices/trafficZoneSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import TrafficZoneForm from './TrafficZoneForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';
import ErrorHandler from '../common/ErrorHandler';
import './TrafficZoneList.css';

const TrafficZoneList = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error } = useSelector((state) => state.trafficZone || state.trafficZones || {});
  const { user } = useSelector((state) => state.auth || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const role = user?.role || localStorage.getItem('role') || '';
  const canAdd = role === 'CITY_ADMINISTRATOR';
  const canEdit = role === 'CITY_ADMINISTRATOR' || role === 'TRAFFIC_CONTROLLER';
  const canDelete = role === 'CITY_ADMINISTRATOR';

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this traffic zone?');
    if (!confirmed) return;

    const resultAction = await dispatch(deleteRecord(id));
    if (deleteRecord.fulfilled.match(resultAction)) {
      const msg = resultAction.payload?.message || 'TrafficZone deleted successfully.';
      setSuccessMessage(msg);
      dispatch(addNotification({ message: msg, type: 'success' }));
      dispatch(fetchAll());
    } else if (deleteRecord.rejected.match(resultAction)) {
      const errMsg = resultAction.payload || 'Failed to delete traffic zone';
      dispatch(addNotification({ message: errMsg, type: 'error' }));
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingZone(null);
    setIsModalOpen(true);
  };

  // Pagination - 5 per page
  const itemsPerPage = 5;
  const rawItems = Array.isArray(items) ? items : [];
  const totalItems = rawItems.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rawItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="zone-list-container">
      <div className="page-header">
        <h1>Traffic Zones</h1>

        {canAdd && (
          <button
            type="button"
            className="btn-add-zone"
            onClick={handleAdd}
          >
            + Add Zone
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
        <EmptyState message="No traffic zones found." />
      ) : (
        <>
          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Zone Name</th>
                  <th>Zone Code</th>
                  <th>District</th>
                  <th>Congestion Level</th>
                  <th>Signal Cycle (s)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((zone) => {
                  const id = zone.zoneId || zone.id;

                  return (
                    <tr key={id}>
                      <td>{zone.zoneName}</td>
                      <td>{zone.zoneCode}</td>
                      <td>{zone.district}</td>
                      <td>{zone.currentCongestionLevel || 'LOW'}</td>
                      <td>{zone.signalCycleSeconds}s</td>
                      <td>
                        <div className="action-button-group">
                          {canEdit && (
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => handleEdit(zone)}
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
        <TrafficZoneForm
          zone={editingZone}
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

export default TrafficZoneList;