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
    <div className="observation-list-container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              Field Observations & Telemetry
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8' }}>
            Live sensor readings, technician field inspections, and on-site sensory reports.
          </p>
        </div>

        <button
          type="button"
          className="btn-add-observation btn-primary"
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.625rem 1.25rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          + Add Record
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
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '80px' }}>
                    ID
                  </th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Observation
                  </th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Sensor Reading
                  </th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Coordinates
                  </th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Technician
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((obs) => {
                  const id = obs.observationId || obs.id;
                  const techName = obs.technician?.fullName || obs.technician?.username || 'Technician';
                  return (
                    <tr
                      key={id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.8125rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            color: '#94a3b8',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                          }}
                        >
                          #{id}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1rem', fontSize: '0.875rem', color: '#f8fafc', maxWidth: '380px' }}>
                        <div style={{ lineHeight: 1.45 }}>{obs.observationText}</div>
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
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
                              color: '#06b6d4',
                              fontWeight: 600,
                              fontFamily: 'monospace',
                              fontSize: '0.875rem',
                            }}
                          >
                            <span>{obs.sensorReadingValue}</span>
                            <span style={{ fontSize: '0.75rem', color: '#a5f3fc', textTransform: 'uppercase' }}>
                              {obs.unit || ''}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.8125rem' }}>N/A</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
                        {obs.latitude != null && obs.longitude != null ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontFamily: 'monospace',
                              color: '#cbd5e1',
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                            </svg>
                            <span>
                              {Number(obs.latitude).toFixed(4)}, {Number(obs.longitude).toFixed(4)}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b' }}>N/A</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(37, 99, 235, 0.2)',
                              border: '1px solid rgba(37, 99, 235, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: '#60a5fa',
                              textTransform: 'uppercase',
                            }}
                          >
                            {techName.charAt(0)}
                          </div>
                          <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{techName}</span>
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