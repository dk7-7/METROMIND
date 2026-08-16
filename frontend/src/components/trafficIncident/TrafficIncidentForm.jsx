import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllZones } from '../../store/trafficZone/trafficZoneActions';
import { createIncident, updateIncident } from '../../store/trafficIncident/trafficIncidentActions';
import ErrorHandler from '../common/ErrorHandler';

const TrafficIncidentForm = ({ incident, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const { zones } = useSelector(state => state.trafficZone);
    const [title, setTitle] = useState(incident?.title || '');
    const [severity, setSeverity] = useState(incident?.severity || 'LOW');
    const [zoneId, setZoneId] = useState(incident?.zoneId || '');
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        dispatch(fetchAllZones());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) return;
        setSaving(true);
        setError(null);
        
        try {
            if (incident) {
                await dispatch(updateIncident({ id: incident.id, data: { title, severity, zoneId } })).unwrap();
                onSuccess('Traffic Incident updated successfully.');
            } else {
                await dispatch(createIncident({ title, severity, zoneId })).unwrap();
                onSuccess('Traffic Incident created successfully.');
            }
        } catch (err) {
            if (err.match && err.match(/already exists/i)) {
                setError(err);
            } else if (err.match && err.match(/unable to save/i)) {
                setError(err);
            } else {
                setError(err);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>{incident ? 'Edit Traffic Incident' : 'Report New Incident'}</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>X</button>
                </div>
                <ErrorHandler error={error} />
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" placeholder="e.g. Major Collision on Main St" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="CRITICAL">CRITICAL</option>
                    </select>
                    <select value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
                        <option value="">Select Zone</option>
                        {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                    </select>
                    <button type="submit" disabled={!title || saving} style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>
                        {incident ? 'Update Incident' : 'Report Incident'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default TrafficIncidentForm;
