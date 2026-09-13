import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, fetchAll } from '../../store/slices/fieldObservationSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';
import './FieldObservationForm.css';

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
          <h2>Add Field Observation</h2>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          >
            X
          </button>
        </div>

        {formError && <ErrorHandler error={formError} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="observationText">Observation Text</label>
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

          <div className="form-group">
            <label htmlFor="sensorReadingValue">Sensor Reading Value</label>
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
            <label htmlFor="unit">Unit</label>
            <input
              id="unit"
              name="unit"
              type="text"
              placeholder="e.g. PSI, °C, kW"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
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
            <label htmlFor="longitude">Longitude</label>
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

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !observationText.trim()}
            >
              Submit Observation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldObservationForm;