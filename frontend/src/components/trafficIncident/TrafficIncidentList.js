import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import TrafficIncidentForm from './TrafficIncidentForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const TrafficIncidentList = () => {
  const { user } = useSelector((state) => state.auth);
  const reduxItems = useSelector((state) => state.trafficIncidents?.items);
  const [items, setItems] = useState(reduxItems || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const userRole = user?.role;
  const isAdmin = userRole === 'CITY_ADMINISTRATOR';

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/traffic-incidents`);
      if (response && response.data) {
        setItems(response.data);
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to fetch traffic incidents';
      setError(message);
      // On fetch failure, keep any pre-existing items from Redux
      if (reduxItems && reduxItems.length > 0) {
        setItems(reduxItems);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (incidentId) => {
    if (!window.confirm('Are you sure you want to delete this incident?')) return;

    try {
      const response = await axios.delete(`${API_URL}/traffic-incidents/${incidentId}`);
      setSuccessMessage(typeof response.data === 'string' ? response.data : response.data?.message);
      setItems((prev) => prev.filter((item) => item.incidentId !== incidentId));
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to delete incident';
      setError(message);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditItem(null);
    fetchItems();
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>
          Traffic Incidents
        </h1>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            + Add Record
          </button>
        )}
      </div>

      {loading && <div>Loading...</div>}

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

      {successMessage && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '6px',
            padding: '12px',
            color: '#10b981',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {successMessage}
        </div>
      )}

      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              padding: '32px',
              width: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>
              Report New Incident
            </h2>
            <TrafficIncidentForm item={editItem} onClose={handleFormClose} />
          </div>
        </div>
      )}

      {items.length === 0 && !error ? (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '48px' }}>
          No traffic incidents found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item) => (
            <div
              key={item.incidentId}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>
                  {item.title}
                </h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#94a3b8' }}>
                  {item.severity && <span>Severity: {item.severity}</span>}
                  {item.incidentType && <span>Type: {item.incidentType}</span>}
                  {item.status && <span>Status: {item.status}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setShowForm(true);
                      }}
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.incidentId)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrafficIncidentList;
