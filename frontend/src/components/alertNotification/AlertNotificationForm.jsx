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
    <div className="modal-overlay form-overlay">
      <div className="modal-content form-modal">
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="modal-icon-badge alert-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            </div>
            <div>
              <h2 className="modal-title">
                Broadcast Operational Alert
              </h2>
              <p className="modal-subtitle">
                Dispatch critical notifications to specific municipal roles
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
                <label htmlFor="targetRole">
                  Target Role
                </label>
                <select
                  ref={firstInputRef}
                  id="targetRole"
                  name="targetRole"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="CITY_ADMINISTRATOR">CITY_ADMINISTRATOR</option>
                  <option value="TRAFFIC_CONTROLLER">TRAFFIC_CONTROLLER</option>
                  <option value="UTILITY_SUPERVISOR">UTILITY_SUPERVISOR</option>
                  <option value="FIELD_TECHNICIAN">FIELD_TECHNICIAN</option>
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
              <label htmlFor="message">
                Alert Message <span className="required-star">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="e.g. Critical traffic diversion required near Sector 4 due to ongoing pipeline repair"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
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
                disabled={submitting || !message.trim()}
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