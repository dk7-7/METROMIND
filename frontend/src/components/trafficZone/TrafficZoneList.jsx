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
    <div className="zone-list-container" style={{ padding: '2rem 1.5rem 3rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Traffic Zones
            </h1>
            <span
              style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '0.775rem',
                fontWeight: 700,
                border: '1px solid #bfdbfe',
              }}
            >
              {items.length} Zones
            </span>
          </div>
          <p className="page-subtitle" style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
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
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <div className="skeleton" style={{ height: '48px', marginBottom: '0.5rem', width: '100%' }} />
          <div className="skeleton" style={{ height: '200px', width: '100%' }} />
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No traffic zones found." />
      ) : (
        <>
          <div className="table-card" style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Zone Name</th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Zone Code</th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>District</th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Congestion</th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cycle (sec)</th>
                  <th style={{ padding: '0.85rem 1.15rem', fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((zone) => {
                  const id = zone.zoneId || zone.id;
                  const congStyle = getCongestionBadge(zone.currentCongestionLevel);

                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1.15rem', fontSize: '0.925rem', fontWeight: 600, color: '#0f172a' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>🚦</span> {zone.zoneName}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem', fontSize: '0.85rem' }}>
                        <code
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: '#f1f5f9',
                            color: '#0f172a',
                            fontWeight: 600,
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          {zone.zoneCode}
                        </code>
                      </td>
                      <td style={{ padding: '0.85rem 1.15rem', fontSize: '0.875rem', color: '#475569' }}>
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