import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, update, fetchAll as fetchOutages } from '../../store/slices/utilityOutageSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';

const UtilityOutageForm = ({ outage = null, onClose, onSuccess }) => {
  const isEditMode = !!outage;
  const dispatch = useDispatch();
  const firstInputRef = useRef(null);

  const [outageType, setOutageType] = useState(outage?.outageType || 'UNPLANNED');
  const [affectedArea, setAffectedArea] = useState(outage?.affectedArea || '');
  const [severity, setSeverity] = useState(outage?.severity || 'MEDIUM');
  const [estimatedRestorationTime, setEstimatedRestorationTime] = useState(
    outage?.estimatedRestorationTime || ''
  );
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (outage) {
      setOutageType(outage.outageType || 'UNPLANNED');
      setAffectedArea(outage.affectedArea || '');
      setSeverity(outage.severity || 'MEDIUM');
      setEstimatedRestorationTime(outage.estimatedRestorationTime || '');
    }
  }, [outage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!affectedArea.trim()) return;

    setFormError(null);
    setSubmitting(true);

    const payload = {
      outageType,
      affectedArea: affectedArea.trim(),
      severity,
      estimatedRestorationTime: estimatedRestorationTime || null,
    };

    try {
      if (isEditMode) {
        const id = outage.outageId || outage.id;
        const resultAction = await dispatch(update({ id, data: payload }));
        if (update.fulfilled.match(resultAction)) {
          dispatch(addNotification({ message: 'UtilityOutage updated successfully.', type: 'success' }));
          await dispatch(fetchOutages());
          if (onSuccess) onSuccess('UtilityOutage updated successfully.');
          if (onClose) onClose();
        } else {
          setFormError(resultAction.payload || 'Failed to update outage');
        }
      } else {
        const resultAction = await dispatch(create(payload));
        if (create.fulfilled.match(resultAction)) {
          dispatch(addNotification({ message: 'UtilityOutage registered successfully.', type: 'success' }));
          await dispatch(fetchOutages());
          if (onSuccess) onSuccess('UtilityOutage registered successfully.');
          if (onClose) onClose();
        } else {
          setFormError(resultAction.payload || 'Failed to register outage');
        }
      }
    } catch (err) {
      setFormError('Failed to save outage');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay form-overlay">
      <div className="modal-content form-modal">
        <div className="modal-header">
          <h2>{isEditMode ? 'Edit Outage' : 'Register Outage'}</h2>
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
            <label htmlFor="outageType">Outage Type</label>
            <select
              ref={firstInputRef}
              id="outageType"
              name="outageType"
              value={outageType}
              onChange={(e) => setOutageType(e.target.value)}
            >
              <option value="UNPLANNED">UNPLANNED</option>
              <option value="PLANNED">PLANNED</option>
              <option value="EMERGENCY">EMERGENCY</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="affectedArea">Affected Area</label>
            <input
              id="affectedArea"
              name="affectedArea"
              type="text"
              placeholder="e.g. Sector 7 & Commercial Hub"
              value={affectedArea}
              onChange={(e) => setAffectedArea(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="severity">Severity</label>
            <select
              id="severity"
              name="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="estimatedRestorationTime">Estimated Restoration Time</label>
            <input
              id="estimatedRestorationTime"
              name="estimatedRestorationTime"
              type="text"
              placeholder="e.g. 2 hours"
              value={estimatedRestorationTime}
              onChange={(e) => setEstimatedRestorationTime(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !affectedArea.trim()}
            >
              {isEditMode ? 'Save Changes' : 'Register Outage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UtilityOutageForm;