import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, fetchAll } from '../../store/slices/alertNotificationSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';

const AlertNotificationForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const firstInputRef = useRef(null);

  const [targetRole, setTargetRole] = useState('CITY_ADMINISTRATOR');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('LOW');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setFormError(null);
    setSubmitting(true);

    const payload = {
      targetRole,
      message: message.trim(),
      severity,
      isRead: false,
    };

    try {
      const resultAction = await dispatch(create(payload));
      if (create.fulfilled.match(resultAction)) {
        dispatch(addNotification({ message: 'Alert broadcasted successfully.', type: 'success' }));
        await dispatch(fetchAll());
        if (onSuccess) onSuccess('Alert broadcasted successfully.');
        if (onClose) onClose();
      } else {
        setFormError(resultAction.payload || 'Failed to create alert');
      }
    } catch (err) {
      setFormError('Failed to create alert notification');
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
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </div>
            <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#f8fafc' }}>
              Broadcast Operational Alert
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
                  htmlFor="targetRole"
                  style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
                >
                  Target Role
                </label>
                <select
                  ref={firstInputRef}
                  id="targetRole"
                  name="targetRole"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
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
                  <option value="CITY_ADMINISTRATOR">CITY_ADMINISTRATOR</option>
                  <option value="TRAFFIC_CONTROLLER">TRAFFIC_CONTROLLER</option>
                  <option value="UTILITY_SUPERVISOR">UTILITY_SUPERVISOR</option>
                  <option value="FIELD_TECHNICIAN">FIELD_TECHNICIAN</option>
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="message"
                style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8125rem', color: '#cbd5e1' }}
              >
                Alert Message <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="e.g. Critical traffic diversion required near Sector 4 due to ongoing pipeline repair"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
                  resize: 'vertical',
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
                disabled={submitting || !message.trim()}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: submitting || !message.trim() ? '#475569' : '#2563eb',
                  color: '#ffffff',
                  cursor: submitting || !message.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  boxShadow: submitting || !message.trim() ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.15s ease',
                }}
              >
                {submitting ? 'Broadcasting...' : 'Send Alert'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlertNotificationForm;