import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { create, update, fetchAll as fetchOutages } from '../../store/slices/utilityOutageSlice';
import { fetchAll as fetchGrids } from '../../store/slices/utilityGridSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const UtilityOutageForm = ({ outage = null, onClose, onSuccess }) => {
  const isEditMode = !!outage;
  const dispatch = useDispatch();

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
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '500px',
          padding: '1.75rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '0.75rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
            {isEditMode ? 'Edit Outage' : 'Register Outage'}
          </h2>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            X
          </button>
        </div>

        {formError && (
          <div
            className="error-alert"
            style={{
              padding: '0.625rem 0.875rem',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '6px',
              border: '1px solid #fca5a5',
              marginBottom: '1rem',
              fontSize: '0.875rem',
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="outageType"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Outage Type
            </label>
            <select
              id="outageType"
              name="outageType"
              value={outageType}
              onChange={(e) => setOutageType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              <option value="UNPLANNED">UNPLANNED</option>
              <option value="PLANNED">PLANNED</option>
              <option value="EMERGENCY">EMERGENCY</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="affectedArea"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Affected Area
            </label>
            <input
              id="affectedArea"
              name="affectedArea"
              type="text"
              placeholder="e.g. Sector 7 & Commercial Hub"
              value={affectedArea}
              onChange={(e) => setAffectedArea(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="severity"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="gridId"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Utility Grid
            </label>
            <select
              id="gridId"
              name="gridId"
              value={gridId}
              onChange={(e) => setGridId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
              }}
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

          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="estimatedRestorationTime"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Estimated Restoration Time
            </label>
            <input
              id="estimatedRestorationTime"
              name="estimatedRestorationTime"
              type="datetime-local"
              value={estimatedRestorationTime}
              onChange={(e) => setEstimatedRestorationTime(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#475569',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !affectedArea.trim()}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: submitting || !affectedArea.trim() ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                cursor: submitting || !affectedArea.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
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