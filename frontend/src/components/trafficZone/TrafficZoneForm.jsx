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
            marginBottom: '1.25rem',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '0.85rem',
          }}
        >
          <div>
            <h2
              className="modal-title"
              style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}
            >
              {isEditMode ? 'Edit Traffic Zone' : 'Add Traffic Zone'}
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              {isEditMode ? `Updating parameters for ${zone.zoneName}` : 'Configure a new traffic monitoring sector'}
            </p>
          </div>
          <button
            type="button"
            className="btn-close close-btn"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            ×
          </button>
        </div>

        {formError && <ErrorHandler error={formError} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.15rem' }}>
            <label
              htmlFor="zoneName"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Zone Name <span style={{ color: '#ef4444' }}>*</span>
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
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.15rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label
                htmlFor="zoneCode"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
              >
                Zone Code <span style={{ color: '#ef4444' }}>*</span>
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
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  backgroundColor: isEditMode ? '#f1f5f9' : '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label
                htmlFor="district"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
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
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label
                htmlFor="currentCongestionLevel"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
              >
                Congestion Level
              </label>
              <select
                id="currentCongestionLevel"
                name="currentCongestionLevel"
                value={currentCongestionLevel}
                onChange={(e) => setCurrentCongestionLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
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
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
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
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            className="modal-actions"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              borderTop: '1px solid #e2e8f0',
              paddingTop: '1rem',
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