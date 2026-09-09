import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAll } from '../../store/slices/fieldObservationSlice';
import FieldObservationForm from './FieldObservationForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

const FieldObservationList = () => {
  const dispatch = useDispatch();
  const { items = [], loading } = useSelector((state) => state.fieldObservation || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  // Pagination - 5 per page
  const itemsPerPage = 5;
  const totalItems = items.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="observation-list-container animate-fade-in">
      {/* Header section */}
      <div className="page-header">
        <div className="page-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h1 className="page-title">
              <span>📋</span> Field Observations
            </h1>
            <span
              style={{
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                fontSize: '0.775rem',
                fontWeight: 700,
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            >
              {items.length} Observations
            </span>
          </div>
          <p className="page-subtitle">
            Live sensor readings, technician field inspections, and on-site sensory reports
          </p>
        </div>

        <button
          type="button"
          className="btn-add-observation btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <span>+</span> Add Observation
        </button>
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
        <EmptyState message="No field observations found." />
      ) : (
        <div className="table-card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Observation</th>
                  <th>Sensor Reading</th>
                  <th>Coordinates</th>
                  <th>Technician</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((obs) => {
                  const id = obs.observationId || obs.id;
                  const techName = obs.technician?.fullName || obs.technician?.username || 'Technician';
                  return (
                    <tr key={id}>
                      <td style={{ fontSize: '0.8125rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-subtle)',
                            color: 'var(--text-muted)',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          #{id}
                        </span>
                      </td>
                      <td style={{ maxWidth: '380px' }}>
                        <div style={{ lineHeight: 1.45, fontWeight: 500 }}>{obs.observationText}</div>
                      </td>
                      <td>
                        {obs.sensorReadingValue != null ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'baseline',
                              gap: '0.35rem',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(6, 182, 212, 0.12)',
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                              color: '#0891b2',
                              fontWeight: 600,
                              fontFamily: 'monospace',
                              fontSize: '0.875rem',
                            }}
                          >
                            <span>{obs.sensorReadingValue}</span>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                              {obs.unit || ''}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>N/A</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {obs.latitude != null && obs.longitude != null ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontFamily: 'monospace',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <span>📍</span>
                            <span>
                              {Number(obs.latitude).toFixed(4)}, {Number(obs.longitude).toFixed(4)}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(37, 99, 235, 0.15)',
                              border: '1px solid rgba(37, 99, 235, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: '#2563eb',
                              textTransform: 'uppercase',
                            }}
                          >
                            {techName.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{techName}</span>
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
        <FieldObservationForm
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

export default FieldObservationList;