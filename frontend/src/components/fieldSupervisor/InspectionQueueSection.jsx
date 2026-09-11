import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import FieldObservationForm from '../fieldObservation/FieldObservationForm';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';

const InspectionQueueSection = ({
  observations = [],
  loading = false,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [verifiedIds, setVerifiedIds] = useState({});

  const handleVerifyInspection = (obsId) => {
    setVerifiedIds((prev) => ({ ...prev, [obsId]: true }));
    dispatch(
      addNotification({
        message: `Field Observation #${obsId} verified & logged to operational record.`,
        type: 'success',
      })
    );
  };

  const filtered = observations.filter((obs) => {
    const text = (obs.observationText || '').toLowerCase();
    const unit = (obs.unit || '').toLowerCase();
    const matchesSearch =
      text.includes(searchTerm.toLowerCase()) ||
      unit.includes(searchTerm.toLowerCase()) ||
      String(obs.observationId || obs.id).includes(searchTerm);
    return matchesSearch;
  });

  const itemsPerPage = 5;
  const totalItems = filtered.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="fs-inspection-section">
      <div className="fs-section-header-row">
        <div>
          <h3 className="fs-section-title">Field Inspection & Observation Queue</h3>
          <p className="fs-section-subtitle">
            Validate field sensor readings, technician on-site telemetry, and hazardous anomaly logs
          </p>
        </div>

        <button
          type="button"
          className="btn-primary fs-btn-add"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add New Field Observation
        </button>
      </div>

      <div className="fs-filter-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search sensor telemetry, notes, or observation ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
      </div>

      {loading && filtered.length === 0 ? (
        <div className="loading-state">Loading field inspection queue...</div>
      ) : filtered.length === 0 ? (
        <EmptyState message="No field observations found in your queue." />
      ) : (
        <>
          <div className="table-card fs-table-card">
            <table>
              <thead>
                <tr>
                  <th>Observation ID</th>
                  <th>Sensor Reading</th>
                  <th>Unit</th>
                  <th>Field Observation Notes</th>
                  <th>GPS Coordinates</th>
                  <th>Supervisor Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((obs) => {
                  const id = obs.observationId || obs.id;
                  const isVerified = !!verifiedIds[id];

                  return (
                    <tr key={id}>
                      <td>
                        <span className="badge-id">#OBS-{id}</span>
                      </td>
                      <td>
                        <span className="fs-sensor-val">
                          {obs.sensorReadingValue != null ? obs.sensorReadingValue : 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="fs-unit-pill">{obs.unit || 'UNITS'}</span>
                      </td>
                      <td className="fs-obs-text-cell">
                        <p className="fs-obs-text">{obs.observationText}</p>
                      </td>
                      <td>
                        <span className="fs-coord-badge">
                          {obs.latitude != null && obs.longitude != null
                            ? `📍 ${obs.latitude.toFixed(4)}, ${obs.longitude.toFixed(4)}`
                            : '📍 On-Site Station'}
                        </span>
                      </td>
                      <td>
                        {isVerified ? (
                          <span className="fs-status-pill fs-status-resolved">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="fs-status-pill fs-status-investigating">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="fs-table-actions">
                          {!isVerified ? (
                            <button
                              type="button"
                              className="btn-action-edit fs-table-btn"
                              onClick={() => handleVerifyInspection(id)}
                            >
                              Verify
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-action-resolve fs-table-btn"
                              disabled
                            >
                              Verified
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
            onPageChange={(p) => setCurrentPage(p)}
          />
        </>
      )}

      {isAddModalOpen && (
        <FieldObservationForm
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(msg) => {
            dispatch(addNotification({ message: msg, type: 'success' }));
            setIsAddModalOpen(false);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default InspectionQueueSection;
