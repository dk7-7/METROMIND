import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAll as fetchZones } from "../../store/slices/trafficZoneSlice";
import {
  createRecord,
  updateRecord,
  fetchAll as fetchIncidents,
} from "../../store/slices/trafficIncidentSlice";

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const TrafficIncidentForm = ({ incident, onClose }) => {
  const isEdit = Boolean(incident);
  const dispatch = useDispatch();
  const { items: zones } = useSelector((state) => state.trafficZone);

  const [title, setTitle] = useState(incident?.title || "");
  const [severity, setSeverity] = useState(incident?.severity || SEVERITIES[0]);
  const [zoneId, setZoneId] = useState(incident?.zone?.zoneId || "");
  const [description, setDescription] = useState(incident?.description || "");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchZones());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      title,
      severity,
      zoneId: zoneId ? Number(zoneId) : undefined,
      description,
    };

    const action = isEdit
      ? updateRecord({ id: incident.incidentId, data: payload })
      : createRecord(payload);

    const result = await dispatch(action);
    setSubmitting(false);

    if (createRecord.fulfilled.match(result) || updateRecord.fulfilled.match(result)) {
      dispatch(fetchIncidents());
      onClose();
    } else {
      const payloadError = result.payload || "";
      if (/already exists/i.test(payloadError) || /conflict/i.test(payloadError)) {
        setError("TrafficIncident already exists");
      } else if (/unable to save/i.test(payloadError) || /internal/i.test(payloadError)) {
        setError("Unable to save incident");
      } else {
        setError(payloadError || "Unable to save incident");
      }
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <button className="close-btn" onClick={onClose} aria-label="close">
          X
        </button>
        <h2>{isEdit ? "Edit Traffic Incident" : "Report New Incident"}</h2>
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="incident-title">Title</label>
            <input
              id="incident-title"
              type="text"
              autoFocus
              placeholder="e.g. Major Collision on Main St"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="incident-severity">Severity</label>
            <select
              id="incident-severity"
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
          <div className="form-group">
            <label htmlFor="incident-zone">Traffic Zone</label>
            <select
              id="incident-zone"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
            >
              <option value="">Select a zone</option>
              {zones.map((z) => (
                <option key={z.zoneId} value={z.zoneId}>
                  {z.zoneName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="incident-description">Description</label>
            <textarea
              id="incident-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={!title || submitting}>
            {isEdit ? "Save Changes" : "Report Incident"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrafficIncidentForm;
