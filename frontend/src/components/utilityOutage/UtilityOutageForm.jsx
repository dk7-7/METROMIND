import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { create, update, fetchAll as fetchOutages } from '../../store/slices/utilityOutageSlice';
import { fetchAll as fetchGrids } from '../../store/slices/utilityGridSlice';
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
    outage?.estimatedRestorationTime ? outage.estimatedRestorationTime.substring(0, 16) : ''
  );
  const [gridId, setGridId] = useState(outage?.grid?.gridId || outage?.gridId || '');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const grids = useSelector((state) => state.utilityGrid?.items || []);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    dispatch(fetchGrids());
  }, [dispatch]);

  useEffect(() => {
    if (outage) {
      setOutageType(outage.outageType || 'UNPLANNED');
      setAffectedArea(outage.affectedArea || '');
      setSeverity(outage.severity || 'MEDIUM');
      setEstimatedRestorationTime(
        outage.estimatedRestorationTime ? outage.estimatedRestorationTime.substring(0, 16) : ''
      );
      setGridId(outage.grid?.gridId || outage.gridId || '');
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
      estimatedRestorationTime: estimatedRestorationTime ? new Date(estimatedRestorationTime).toISOString() : null,
      gridId: gridId ? Number(gridId) : (grids[0]?.gridId || grids[0]?.id || 1),
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
          <div className="modal-header-icon-title">
            <div className="modal-icon-badge outage-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </div>
            <div>
              <h2 className="modal-title">
                {isEditMode ? 'Modify Outage Record' : 'Log Utility Outage'}
              </h2>
              <p className="modal-subtitle">
                {isEditMode ? `Updating outage record #${outage.outageId || outage.id}` : 'Report service interruption and restoration timeline'}
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
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="outageType">
                  Outage Type
                </label>
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
                <label htmlFor="severity">
                  Severity
                </label>
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
            </div>

            <div className="form-group">
              <label htmlFor="affectedArea">
                Affected Area <span className="required-star">*</span>
              </label>
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
              <label htmlFor="gridId">
                Associated Utility Grid
              </label>
              <select
                id="gridId"
                name="gridId"
                value={gridId}
                onChange={(e) => setGridId(e.target.value)}
              >
                <option value="">Select a Grid</option>
                {grids.map((g) => {
                  const gId = g.gridId || g.id;
                  return (
                    <option key={gId} value={gId}>
                      {g.gridName} ({g.gridType})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="estimatedRestorationTime">
                Estimated Restoration Time
              </label>
              <input
                id="estimatedRestorationTime"
                name="estimatedRestorationTime"
                type="datetime-local"
                value={estimatedRestorationTime}
                onChange={(e) => setEstimatedRestorationTime(e.target.value)}
              />
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
                disabled={submitting || !affectedArea.trim()}
              >
                {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Register Outage'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UtilityOutageForm;