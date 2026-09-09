import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll, deleteRecord } from '../../store/slices/trafficZoneSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import TrafficZoneForm from './TrafficZoneForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

const TrafficZoneList = () => {
  const dispatch = useDispatch();
  const { items = [], loading } = useSelector((state) => state.trafficZone || {});
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
      const msg = 'TrafficZone deleted successfully.';
      setSuccessMessage(msg);
      dispatch(addNotification({ message: msg, type: 'success' }));
      dispatch(fetchAll());
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
  const totalItems = items.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="zone-list-container">
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-title-row">
            <h1 className="page-title">
              Traffic Zones
            </h1>
            <span className="badge-record-count">
              {items.length} Zones
            </span>
          </div>
          <p className="page-subtitle">
            Municipal corridor surveillance, traffic signal cycles, and real-time congestion monitoring
          </p>
        </div>

        {canAdd && (
          <button
            type="button"
            className="btn-add-zone btn-primary"
            onClick={handleAdd}
          >
            <span>+</span> Add Traffic Zone
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
                  <th>Congestion</th>
                  <th>Cycle (sec)</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((zone) => {
                  const id = zone.zoneId || zone.id;
                  const congLevel = (zone.currentCongestionLevel || 'low').toLowerCase();

                  return (
                    <tr key={id}>
                      <td className="td-zone-name">
                        <span className="zone-icon-title">
                          <span>🚦</span> {zone.zoneName}
                        </span>
                      </td>
                      <td>
                        <code className="zone-code-badge">
                          {zone.zoneCode}
                        </code>
                      </td>
                      <td className="td-district">
                        {zone.district}
                      </td>
                      <td>
                        <span className={`status-badge congestion-${congLevel}`}>
                          <span className="status-dot" />
                          {zone.currentCongestionLevel || 'LOW'}
                        </span>
                      </td>
                      <td className="td-cycle">
                        <span className="cycle-badge">
                          <span>⏱️</span> {zone.signalCycleSeconds}s
                        </span>
                      </td>
                      <td className="td-actions">
                        <div className="action-button-group">
                          {canEdit && (
                            <button
                              type="button"
                              className="btn-action-edit"
                              onClick={() => handleEdit(zone)}
                              aria-label={`Edit zone ${zone.zoneName}`}
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="btn-delete"
                              onClick={() => handleDelete(id)}
                              aria-label={`Delete zone ${zone.zoneName}`}
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