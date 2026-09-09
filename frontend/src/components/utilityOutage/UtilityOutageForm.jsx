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
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="modal-content animate-fade-in"
        style={{
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '520px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f97316',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc' }}>
              {isEditMode ? 'Modify Outage Record' : 'Log Utility Outage'}
            </h2>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.125rem',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '0.35rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {formError && <ErrorHandler error={formError} />}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label
                  htmlFor="outageType"
                  style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
                >
                  Outage Type
                </label>
                <select
                  ref={firstInputRef}
                  id="outageType"
                  name="outageType"
                  value={outageType}
                  onChange={(e) => setOutageType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                >
                  <option value="UNPLANNED">UNPLANNED</option>
                  <option value="PLANNED">PLANNED</option>
                  <option value="EMERGENCY">EMERGENCY</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="severity"
                  style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
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
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backgroundColor: '#1e293b',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="affectedArea"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
              >
                Affected Area <span style={{ color: '#ef4444' }}>*</span>
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
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="gridId"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
              >
                Associated Utility Grid
              </label>
              <select
                id="gridId"
                name="gridId"
                value={gridId}
                onChange={(e) => setGridId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: '#1e293b',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none',
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="estimatedRestorationTime"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
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
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#f8fafc',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                  colorScheme: 'dark',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.55rem 1.125rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit btn-primary"
                disabled={submitting || !affectedArea.trim()}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: submitting || !affectedArea.trim() ? '#475569' : '#2563eb',
                  color: '#ffffff',
                  cursor: submitting || !affectedArea.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  boxShadow: submitting || !affectedArea.trim() ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.15s ease',
                }}
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