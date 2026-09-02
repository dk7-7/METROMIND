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
    <div className="zone-list-container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Traffic Zones
        </h1>

        {canAdd && (
          <button
            type="button"
            className="btn-add-zone"
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
          Loading traffic zones...
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No traffic zones found." />
      ) : (
        <>
          <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Zone Name</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Zone Code</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>District</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Congestion</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Cycle (sec)</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#475569', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((zone) => {
                  const id = zone.zoneId || zone.id;
                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                        {zone.zoneName}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        <code>{zone.zoneCode}</code>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#475569' }}>
                        {zone.district}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontWeight: 600,
                            backgroundColor:
                              zone.currentCongestionLevel === 'SEVERE' ? '#fee2e2' :
                              zone.currentCongestionLevel === 'HIGH' ? '#ffedd5' :
                              zone.currentCongestionLevel === 'MODERATE' ? '#fef3c7' : '#dcfce7',
                            color:
                              zone.currentCongestionLevel === 'SEVERE' ? '#b91c1c' :
                              zone.currentCongestionLevel === 'HIGH' ? '#c2410c' :
                              zone.currentCongestionLevel === 'MODERATE' ? '#b45309' : '#15803d',
                          }}
                        >
                          {zone.currentCongestionLevel || 'LOW'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#475569' }}>
                        {zone.signalCycleSeconds}s
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleEdit(zone)}
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