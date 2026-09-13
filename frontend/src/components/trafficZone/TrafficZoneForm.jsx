import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, update, fetchAll } from '../../store/slices/trafficZoneSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';
import './TrafficZoneForm.css';

const TrafficZoneForm = ({ zone = null, onClose, onSuccess }) => {
  const isEditMode = !!zone;
  const dispatch = useDispatch();
  const firstInputRef = useRef(null);

  const [zoneName, setZoneName] = useState(zone?.zoneName || '');
  const [zoneCode, setZoneCode] = useState(zone?.zoneCode || '');
  const [district, setDistrict] = useState(zone?.district || '');
  const [currentCongestionLevel, setCurrentCongestionLevel] = useState(
    zone?.currentCongestionLevel || 'LOW'
  );
  const [signalCycleSeconds, setSignalCycleSeconds] = useState(
    zone?.signalCycleSeconds || 60
  );
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (zone) {
      setZoneName(zone.zoneName || '');
      setZoneCode(zone.zoneCode || '');
      setDistrict(zone.district || '');
      setCurrentCongestionLevel(zone.currentCongestionLevel || 'LOW');
      setSignalCycleSeconds(zone.signalCycleSeconds || 60);
    }
  }, [zone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zoneName.trim() || !zoneCode.trim()) return;

    setFormError(null);
    setSubmitting(true);

    const payload = {
      zoneName: zoneName.trim(),
      zoneCode: zoneCode.trim(),
      district: district.trim(),
      currentCongestionLevel,
      signalCycleSeconds: Number(signalCycleSeconds),
    };

    try {
      if (isEditMode) {
        const id = zone.zoneId || zone.id;
        const resultAction = await dispatch(update({ id, data: payload }));
        if (update.fulfilled.match(resultAction)) {
          dispatch(addNotification({ message: 'TrafficZone updated successfully.', type: 'success' }));
          await dispatch(fetchAll());
          if (onSuccess) onSuccess('TrafficZone updated successfully.');
          if (onClose) onClose();
        } else {
          setFormError(resultAction.payload || 'Failed to update traffic zone');
        }
      } else {
        const resultAction = await dispatch(create(payload));
        if (create.fulfilled.match(resultAction)) {
          dispatch(addNotification({ message: 'TrafficZone created successfully.', type: 'success' }));
          await dispatch(fetchAll());
          if (onSuccess) onSuccess('TrafficZone created successfully.');
          if (onClose) onClose();
        } else {
          setFormError(resultAction.payload || 'Failed to create traffic zone');
        }
      }
    } catch (err) {
      setFormError('Failed to save traffic zone');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay form-overlay">
      <div className="modal-content form-modal">
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Traffic Zone' : 'Add Traffic Zone'}</h2>
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
            <label htmlFor="zoneName">Zone Name</label>
            <input
              ref={firstInputRef}
              id="zoneName"
              name="zoneName"
              type="text"
              placeholder="e.g. Downtown Central"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="zoneCode">Zone Code</label>
            <input
              id="zoneCode"
              name="zoneCode"
              type="text"
              placeholder="e.g. Z-101"
              value={zoneCode}
              onChange={(e) => setZoneCode(e.target.value)}
              required
              disabled={isEditMode}
            />
          </div>

          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              id="district"
              name="district"
              type="text"
              placeholder="e.g. Central City"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentCongestionLevel">Congestion Level</label>
            <select
              id="currentCongestionLevel"
              name="currentCongestionLevel"
              value={currentCongestionLevel}
              onChange={(e) => setCurrentCongestionLevel(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MODERATE">MODERATE</option>
              <option value="HIGH">HIGH</option>
              <option value="SEVERE">SEVERE</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="signalCycleSeconds">Signal Cycle (Seconds)</label>
            <input
              id="signalCycleSeconds"
              name="signalCycleSeconds"
              type="number"
              min="10"
              max="300"
              value={signalCycleSeconds}
              onChange={(e) => setSignalCycleSeconds(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !zoneName.trim() || !zoneCode.trim()}
            >
              {isEditMode ? 'Save Changes' : 'Add Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrafficZoneForm;