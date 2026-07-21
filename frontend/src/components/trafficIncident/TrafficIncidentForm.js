import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const TrafficIncidentForm = ({ item, onClose = () => {} }) => {
  const { items: zones } = useSelector((state) => state.trafficZones);

  const [title, setTitle] = useState(item?.title || '');
  const [severity, setSeverity] = useState(item?.severity || 'LOW');
  const [incidentType, setIncidentType] = useState(item?.incidentType || 'ACCIDENT');
  const [status, setStatus] = useState(item?.status || 'REPORTED');
  const [description, setDescription] = useState(item?.description || '');
  const [zoneId, setZoneId] = useState(item?.zoneId || '');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const titleRef = useRef(null);

  const isEdit = !!item?.incidentId;

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      severity,
      incidentType,
      status,
      description,
      zoneId,
    };

    try {
      if (isEdit) {
        await axios.put(`${API_URL}/traffic-incidents/${item.incidentId}`, payload);
      } else {
        await axios.post(`${API_URL}/traffic-incidents`, payload);
      }
      onClose();
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred while saving';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '6px',
            padding: '12px',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="title"
          style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}
        >
          Incident Title
        </label>
        <input
          ref={titleRef}
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Major Collision on Main St"
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: '#f1f5f9',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="severity"
          style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}
        >
          Severity
        </label>
        <select
          id="severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: '#f1f5f9',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="incidentType"
          style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}
        >
          Incident Type
        </label>
        <select
          id="incidentType"
          value={incidentType}
          onChange={(e) => setIncidentType(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: '#f1f5f9',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        >
          <option value="ACCIDENT">ACCIDENT</option>
          <option value="CONGESTION">CONGESTION</option>
          <option value="ROAD_CLOSURE">ROAD CLOSURE</option>
          <option value="CONSTRUCTION">CONSTRUCTION</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="status"
          style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: '#f1f5f9',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        >
          <option value="REPORTED">REPORTED</option>
          <option value="INVESTIGATING">INVESTIGATING</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="description"
          style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident..."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: '#f1f5f9',
            fontSize: '14px',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
        />
      </div>

      {zones && zones.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="zoneId"
            style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}
          >
            Traffic Zone
          </label>
          <select
            id="zoneId"
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#f1f5f9',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select Zone</option>
            {zones.map((zone) => (
              <option key={zone.zoneId} value={zone.zoneId}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'rgba(148, 163, 184, 0.1)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: '#94a3b8',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Report Incident'}
        </button>
      </div>
    </form>
  );
};

export default TrafficIncidentForm;
