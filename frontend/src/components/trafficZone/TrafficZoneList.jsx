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

  const getCongestionBadge = (level) => {
    switch (level) {
      case 'SEVERE':
        return { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', dot: '#ef4444' };
      case 'HIGH':
        return { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', dot: '#f97316' };
      case 'MODERATE':
        return { bg: '#fffbeb', border: '#fde68a', text: '#b45309', dot: '#f59e0b' };
      case 'LOW':
      default:
        return { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', dot: '#10b981' };
    }
  };

  return (
    <div className="zone-list-container">
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title">
              Traffic Zones
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
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <div className="skeleton" style={{ height: '48px', marginBottom: '0.5rem', width: '100%' }} />
          <div className="skeleton" style={{ height: '200px', width: '100%' }} />
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
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((zone) => {
                  const id = zone.zoneId || zone.id;
                  const congStyle = getCongestionBadge(zone.currentCongestionLevel);

                  return (
                    <tr key={id}>
                      <td style={{ fontSize: '0.925rem', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>🚦</span> {zone.zoneName}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>
                        <code
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-main)',
                            fontWeight: 600,
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {zone.zoneCode}
                        </code>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {zone.district}
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem' }}>
                        <span
                          className="status-badge"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            backgroundColor: congStyle.bg,
                            color: congStyle.text,
                            border: `1px solid ${congStyle.border}`,
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: congStyle.dot }} />
                          {zone.currentCongestionLevel || 'LOW'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem', fontSize: '0.875rem', color: '#334155', fontWeight: 600 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span>⏱️</span> {zone.signalCycleSeconds}s
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
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