import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, update, fetchAll } from '../../store/slices/trafficZoneSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';

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
    <div
      className="modal-overlay form-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        className="modal-content form-modal"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '520px',
          padding: '1.75rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
        }}
      >
        <div
          className="modal-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem',
          }}
        >
          <div>
            <h2
              className="modal-title"
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 750,
                color: 'var(--text-main)',
              }}
            >
              {isEditMode ? 'Edit Traffic Zone' : 'Register New Traffic Zone'}
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isEditMode ? `Updating zone record #${targetId}` : 'Establish municipal monitoring zone and signal timing'}
            </p>
          </div>
          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {formError && <ErrorHandler error={formError} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="zoneName"
              style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.835rem', color: 'var(--text-secondary)' }}
            >
              Zone Name <span style={{ color: 'var(--danger-text)' }}>*</span>
            </label>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label
                htmlFor="zoneCode"
                style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.835rem', color: 'var(--text-secondary)' }}
              >
                Zone Code <span style={{ color: 'var(--danger-text)' }}>*</span>
              </label>
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

            <div className="form-group" style={{ margin: 0 }}>
              <label
                htmlFor="district"
                style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.835rem', color: 'var(--text-secondary)' }}
              >
                District
              </label>
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label
                htmlFor="currentCongestionLevel"
                style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.835rem', color: 'var(--text-secondary)' }}
              >
                Congestion Level
              </label>
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

            <div className="form-group" style={{ margin: 0 }}>
              <label
                htmlFor="signalCycleSeconds"
                style={{ display: 'block', marginBottom: '0.45rem', fontWeight: 600, fontSize: '0.835rem', color: 'var(--text-secondary)' }}
              >
                Signal Cycle (Seconds)
              </label>
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
          </div>

          <div
            className="modal-actions"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.25rem',
            }}
          >
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
              disabled={submitting || !zoneName.trim() || !zoneCode.trim()}
            >
              {submitting ? 'Processing...' : isEditMode ? 'Save Changes' : 'Add Zone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrafficZoneForm;