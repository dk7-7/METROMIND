import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, fetchAll } from '../../store/slices/fieldObservationSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';

const FieldObservationForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const firstInputRef = useRef(null);

  const [observationText, setObservationText] = useState('');
  const [sensorReadingValue, setSensorReadingValue] = useState('');
  const [unit, setUnit] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!observationText.trim()) return;

    setFormError(null);
    setSubmitting(true);

    const payload = {
      observationText: observationText.trim(),
      sensorReadingValue: sensorReadingValue ? Number(sensorReadingValue) : null,
      unit: unit.trim(),
      latitude: latitude ? Number(latitude) : 0.0,
      longitude: longitude ? Number(longitude) : 0.0,
    };

    try {
      const resultAction = await dispatch(create(payload));
      if (create.fulfilled.match(resultAction)) {
        dispatch(addNotification({ message: 'Field observation submitted successfully.', type: 'success' }));
        await dispatch(fetchAll());
        if (onSuccess) onSuccess('Field observation submitted successfully.');
        if (onClose) onClose();
      } else {
        setFormError(resultAction.payload || 'Failed to submit observation');
      }
    } catch (err) {
      setFormError('Failed to submit field observation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay form-overlay">
      <div className="modal-content form-modal">
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="modal-icon-badge observation-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h2 className="modal-title">
                Submit Field Observation
              </h2>
              <p className="modal-subtitle">
                Log field technician notes and telemetry readings
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div>
          {formError && <ErrorHandler error={formError} />}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="observationText">
                Observation Notes <span className="required-star">*</span>
              </label>
              <textarea
                ref={firstInputRef}
                id="observationText"
                name="observationText"
                rows={3}
                placeholder="e.g. Pipeline pressure anomaly observed at junction 4"
                value={observationText}
                onChange={(e) => setObservationText(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="sensorReadingValue">
                  Reading Value
                </label>
                <input
                  id="sensorReadingValue"
                  name="sensorReadingValue"
                  type="number"
                  step="any"
                  placeholder="e.g. 142.5"
                  value={sensorReadingValue}
                  onChange={(e) => setSensorReadingValue(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">
                  Unit of Measurement
                </label>
                <input
                  id="unit"
                  name="unit"
                  type="text"
                  placeholder="e.g. PSI, °C, kW"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="latitude">
                  GPS Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 12.9716"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">
                  GPS Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="e.g. 77.5946"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit btn-primary"
                disabled={submitting || !observationText.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Observation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FieldObservationForm;