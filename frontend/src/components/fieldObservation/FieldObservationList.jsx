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
          <div className="page-title-row">
            <h1 className="page-title">
              <span>📋</span> Field Observations
            </h1>
            <span className="badge-record-count">
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
        <div className="loading-state">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No field observations found." />
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th className="th-id">ID</th>
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
                      <td>
                        <span className="badge-id">
                          #{id}
                        </span>
                      </td>
                      <td className="td-observation-text">
                        <div className="observation-text">{obs.observationText}</div>
                      </td>
                      <td>
                        {obs.sensorReadingValue != null ? (
                          <div className="sensor-reading-badge">
                            <span>{obs.sensorReadingValue}</span>
                            <span className="sensor-reading-unit">
                              {obs.unit || ''}
                            </span>
                          </div>
                        ) : (
                          <span className="na-text">N/A</span>
                        )}
                      </td>
                      <td className="td-coordinates">
                        {obs.latitude != null && obs.longitude != null ? (
                          <div className="coordinates-badge">
                            <span>📍</span>
                            <span>
                              {Number(obs.latitude).toFixed(4)}, {Number(obs.longitude).toFixed(4)}
                            </span>
                          </div>
                        ) : (
                          <span className="na-text">N/A</span>
                        )}
                      </td>
                      <td>
                        <div className="technician-wrapper">
                          <div className="technician-avatar">
                            {techName.charAt(0)}
                          </div>
                          <span className="technician-name">{techName}</span>
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