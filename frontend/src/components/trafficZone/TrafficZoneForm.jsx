import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { create, update, fetchAll } from '../../store/slices/trafficZoneSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const TrafficZoneForm = ({ zone = null, onClose, onSuccess }) => {
  const isEditMode = !!zone;
  const dispatch = useDispatch();

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
            {isEditMode ? 'Edit Traffic Zone' : 'Add Traffic Zone'}
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
              htmlFor="zoneName"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Zone Name
            </label>
            <input
              id="zoneName"
              name="zoneName"
              type="text"
              placeholder="e.g. Downtown Central"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
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
              htmlFor="zoneCode"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Zone Code
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
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                backgroundColor: isEditMode ? '#f1f5f9' : '#ffffff',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
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
                padding: '0.5rem 0.75rem',
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

          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="signalCycleSeconds"
              style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: '#334155' }}
            >
              Signal Cycle Seconds
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
              disabled={submitting || !zoneName.trim() || !zoneCode.trim()}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: submitting || !zoneName.trim() || !zoneCode.trim() ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                cursor: submitting || !zoneName.trim() || !zoneCode.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
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