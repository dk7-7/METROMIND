import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createAlert, fetchAll } from "../../store/slices/alertNotificationSlice";

const ROLES = [
  "CITY_ADMINISTRATOR",
  "TRAFFIC_CONTROLLER",
  "UTILITY_SUPERVISOR",
  "FIELD_TECHNICIAN",
];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const AlertNotificationForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [targetRole, setTargetRole] = useState(ROLES[0]);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState(SEVERITIES[0]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await dispatch(createAlert({ targetRole, message, severity }));
    if (createAlert.fulfilled.match(result)) {
      dispatch(fetchAll());
      onClose();
    } else {
      setError(result.payload || "Unable to create alert");
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <button className="close-btn" onClick={onClose} aria-label="close">
          X
        </button>
        <h2>Add Alert</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="alert-role">Target Role</label>
            <select
              id="alert-role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="alert-message">Message</label>
            <textarea
              id="alert-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="alert-severity">Severity</label>
            <select
              id="alert-severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={!message}>
            Broadcast Alert
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlertNotificationForm;
