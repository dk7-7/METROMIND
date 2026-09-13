import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { create, fetchAll } from '../../store/slices/alertNotificationSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import ErrorHandler from '../common/ErrorHandler';
import './AlertNotificationForm.css';

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
          <h2>Broadcast Alert</h2>
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
            <label htmlFor="targetRole">Target Role</label>
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
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="e.g. Critical traffic diversion required near Sector 4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting || !message.trim()}
            >
              Send Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertNotificationForm;